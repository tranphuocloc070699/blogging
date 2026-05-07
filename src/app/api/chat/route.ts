import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { postRepository } from "@/repositories/post.repository";
import { deepseek } from "@ai-sdk/deepseek"

import { unstable_cache } from "next/cache";
import {
    streamText,
    convertToModelMessages,
    createUIMessageStream,
    createUIMessageStreamResponse,
    type LanguageModel,
    type UIMessage,
} from "ai";
import { z } from "zod";

interface ChatRequest {
    system?: string;
    messages: UIMessage[];
    tools: Record<string, { description?: string; parameters: unknown }>;
}

function isAuthRequired(messages: UIMessage[]): boolean {
    const last = [...messages].reverse().find(m => m.role === "user");
    if (!last) return false;
    const text = last.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map(p => p.text)
        .join(" ");
    return /liked?|favourit|favorite|saved|my post/i.test(text);
}

function isBlogRelated(messages: UIMessage[]): boolean {
    const last = [...messages].reverse().find(m => m.role === "user");
    if (!last) return true;
    const text = last.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map(p => p.text)
        .join(" ");
    return /post|article|blog|read|topic|tag|categor|latest|newest|recent|find|search|show|list|about|summar|explain|describ|tell|what|how|why|author|who|contact|skill|job|experience/i.test(text);
}

const getCachedPosts = unstable_cache(
    async () => {
        return prisma.post.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            include: {
                postTerms: { include: { term: true } },
                _count: { select: { likes: true, comments: true } },
            },
        });
    },
    ["published-posts"],
    { tags: ["posts"], revalidate: 60 * 5 }
);

type RawPost = Awaited<ReturnType<typeof getCachedPosts>>[number];

function shapePosts(rawPosts: RawPost[], likedPostIds: Set<number>) {
    console.log({ rawPosts })
    return rawPosts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        thumbnail: post.thumbnail,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
        keywords: post.keywords,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked: likedPostIds.has(post.id),
        terms: post.postTerms.map(pt => ({
            id: pt.term.id,
            name: pt.term.name,
            slug: pt.term.slug,
        })),
    }));
}
type ShapedPost = ReturnType<typeof shapePosts>[number];


function buildSystemPrompt(posts: ShapedPost[], userId?: string) {
    const index = posts
        .map(p => `- ${p.title} | slug: "${p.slug}"`)
        .join("\n");

    return `
You are a helpful assistant for a personal blog.

Formatting rules:
- Use minimal icons — only when truly necessary (e.g. ✉️ for email, 🔗 for links)
- Never use decorative icons like 🚀 📰 🎥 🏢 — keep responses professional and clean
- Always render contact links as clickable markdown: [Label](url)
- Never display raw URLs as plain text — always wrap them in markdown links
- Keep responses concise and structured

Rules:
- To find relevant posts for a query → call search_posts
- To get full post content → call get_post_content
- To answer questions about the author → call get_author_info
- Always format post links as markdown: [Post Title](/posts/slug)
- Never expose raw IDs or internal fields
- Never make up content or author info — always fetch it first

${userId
            ? `The current user is logged in (userId: ${userId}).`
            : `The current user is NOT logged in. If they ask about liked or saved posts, say: "Please log in first!"`
        }

Available posts:
${index}
`.trim();
}
export async function POST(req: Request) {
    const { messages, tools: frontendToolDefs }: ChatRequest = await req.json();
    const model: LanguageModel = deepseek("deepseek-v4-flash");

    // Each status message needs a unique stable ID
    const STATUS_ID = "status-" + crypto.randomUUID();

    const stream = createUIMessageStream({
        execute: async ({ writer }) => {

            // ── Helper: write a status step as a text block ────────
            // Uses text-start → text-delta → text-end pattern
            // Each step gets a unique id so they render as separate blocks
            const writeStep = async (message: string) => {
                const id = `${STATUS_ID}-${Date.now()}`;
                writer.write({ type: "text-start", id });
                writer.write({
                    type: "text-delta",
                    id,
                    delta: `__STATUS__${message}`,
                });
                writer.write({ type: "text-end", id });
            };


            // ── Phase 1: Auth ──────────────────────────────────────
            await writeStep("Checking your message...");

            const session = await auth();
            const userId = session?.user?.id;

            // ── Phase 2: Validate ──────────────────────────────────
            if (isAuthRequired(messages) && !userId) {
                await writeStep("Login required");
                const result = streamText({
                    model,
                    messages: await convertToModelMessages(messages),
                    system: `Respond with exactly: "Please log in first so I can personalize your experience! 🔐"`,
                });
                writer.merge(result.toUIMessageStream());
                return;
            }

            if (!isBlogRelated(messages)) {
                await writeStep("Checking relevance...");
                const result = streamText({
                    model,
                    messages: await convertToModelMessages(messages),
                    system: `Politely say you can only help with questions about the blog posts.`,
                });
                writer.merge(result.toUIMessageStream());
                return;
            }

            await writeStep("Message looks good");

            // ── Phase 3: Fetch posts ───────────────────────────────
            await writeStep("Loading blog posts...");
            const rawPosts = await getCachedPosts();
            await writeStep(`Found ${rawPosts.length} posts`);

            // ── Phase 4: User data ─────────────────────────────────
            if (userId) {
                await writeStep("Loading your preferences...");
            }

            const likedPostIds = userId && rawPosts.length > 0
                ? await postRepository.findLikedPostIds(
                    Number.parseInt(userId),
                    rawPosts.map(p => p.id)
                )
                : new Set<number>();

            const posts = shapePosts(rawPosts, likedPostIds);

            // ── Phase 5: AI ────────────────────────────────────────
            await writeStep("AI is thinking...");

            const result = streamText({
                model,
                messages: await convertToModelMessages(messages),
                system: buildSystemPrompt(posts, userId),
                tools: {
                    get_author_info: {
                        description: "Get information about the blog author — who they are, their job, skills, experience, and contact details. Call this when the user asks about the author, developer, or owner of this blog.",
                        inputSchema: z.object({}),
                        execute: async () => {
                            await writeStep("Loading author info...");
                            const { readFileSync } = await import("fs");
                            const { join } = await import("path");
                            const content = readFileSync(join(process.cwd(), "public/content/author.md"), "utf-8");
                            return { author: content };
                        },
                    },
                    get_post_content: {
                        description: "Fetch the full content of a post by slug. Call this when the user asks what a post covers, wants a summary, or asks for details.",
                        inputSchema: z.object({
                            slug: z.string().describe("The post slug"),
                        }),
                        execute: async ({ slug }) => {
                            await writeStep(`Reading "${slug}"...`);
                            const post = await prisma.post.findUnique({
                                where: { slug },
                                select: { title: true, content: true, excerpt: true },
                            });
                            if (!post) return { error: `Post "${slug}" not found.` };

                            const { extractTextFromTiptap } = await import("@/lib/post-embedding");
                            return {
                                title: post.title,
                                excerpt: post.excerpt,
                                content: extractTextFromTiptap(post.content).slice(0, 6000),
                            };
                        },
                    },
                    search_posts: {
                        description: "Search blog posts by keyword, topic, or term name.",
                        inputSchema: z.object({
                            query: z.string().describe(
                                "The keyword or topic e.g. 'supabase', 'nextjs', 'authentication'"
                            ),
                        }),
                        execute: async ({ query }) => {
                            await writeStep(`Searching "${query}"...`);

                            const { generateEmbedding } = await import("@/lib/post-embedding");
                            const queryEmbedding = await generateEmbedding(query);
                            const results = await postRepository.searchPostsBySimilarity({
                                queryEmbedding,
                                limit: 5,
                            });

                            await writeStep(
                                results.length > 0
                                    ? `Found ${results.length} relevant post${results.length > 1 ? "s" : ""}`
                                    : `No relevant posts found for "${query}"`
                            );

                            // Enrich with full shaped post data
                            const matched = results
                                .map(r => posts.find(p => p.id === r.id))
                                .filter(Boolean);

                            return {
                                found: matched.length,
                                posts: matched,
                                message: matched.length === 0
                                    ? `No posts found about "${query}".`
                                    : undefined,
                            };
                        },
                    },

                    get_liked_posts: {
                        description: "Get posts the current user has liked.",
                        inputSchema: z.object({}),
                        execute: async () => {
                            await writeStep("Fetching your liked posts...");
                            if (!userId) {
                                await writeStep("Login required");
                                return {
                                    found: 0, posts: [],
                                    requiresAuth: true,
                                    message: "Please log in first",
                                };
                            }
                            const liked = posts.filter(p => p.isLiked);
                            await writeStep(`Found ${liked.length} liked post${liked.length !== 1 ? "s" : ""}`);
                            return {
                                found: liked.length,
                                posts: liked,
                                requiresAuth: false,
                                message: liked.length === 0 ? "You haven't liked any posts yet." : undefined,
                            };
                        },
                    },

                    get_newest_posts: {
                        description: "Get the N most recently published posts.",
                        inputSchema: z.object({
                            count: z.number().min(1).max(12).default(3).optional().describe(
                                "How many posts to return. Default to 3 if not specified."
                            ),
                        }),
                        execute: async ({ count }) => {
                            await writeStep(`Fetching ${count} newest posts...`);
                            const newest = posts.slice(0, count);
                            await writeStep(`Got ${newest.length} posts`);
                            return { found: newest.length, posts: newest };
                        },
                    },

                    get_posts_by_term: {
                        description: "Get posts that belong to a specific category or tag.",
                        inputSchema: z.object({
                            termSlug: z.string().describe(
                                "The slug of the category or tag e.g. 'nextjs', 'supabase'."
                            ),
                        }),
                        execute: async ({ termSlug }) => {
                            await writeStep(`Fetching posts in "${termSlug}"...`);
                            const matched = posts.filter(p =>
                                p.terms.some(t => t.slug === termSlug)
                            );
                            await writeStep(
                                matched.length > 0
                                    ? `Found ${matched.length} posts`
                                    : "No posts found"
                            );
                            return {
                                found: matched.length,
                                posts: matched,
                                message: matched.length === 0
                                    ? `No posts found in category "${termSlug}".`
                                    : undefined,
                            };
                        },
                    },
                    ...frontendToolDefs ?? {},
                },
                onChunk: ({ chunk }) => {
                    if (chunk.type === "text-delta") process.stdout.write(chunk.text);
                    if (chunk.type === "tool-call") {

                        console.log("🔧", chunk.toolName, chunk.input);
                    }
                },

                onFinish: async ({ usage, finishReason }) => {
                    console.log("✨ Done:", { finishReason, usage });
                },
            });

            writer.merge(result.toUIMessageStream());
        },

        onError: (error) => {
            console.error("Stream error:", error);
            return `An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`;
        },
    });

    return createUIMessageStreamResponse({ stream });
}