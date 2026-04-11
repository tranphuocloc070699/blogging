import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { postRepository } from "@/repositories/post.repository";
import { groq } from "@ai-sdk/groq";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
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
    return /post|article|blog|read|topic|tag|categor|latest|newest|recent|find|search|show|list|about/i.test(text);
}

const getCachedPosts = unstable_cache(
    async () => {
        console.log("🔵 Cache MISS — hitting database");
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
    return rawPosts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        thumbnail: post.thumbnail,
        publishedAt: post.publishedAt?.toISOString() ?? null,
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

function buildSystemPrompt(posts: ReturnType<typeof shapePosts>, userId?: string) {
    return `
You are a helpful assistant for a personal blog.
You can ONLY answer questions about the blog posts listed below.
If the user asks anything unrelated to these posts, politely decline.

${userId
            ? `The current user is logged in (userId: ${userId}).`
            : `The current user is NOT logged in.
           If they ask about liked, saved, or personal posts, respond:
           "Please log in first so I can personalize your experience!"`
        }

Here are all published blog posts:
<posts>
${JSON.stringify(posts, null, 2)}
</posts>

Rules:
- Only use information from the posts above
- Always format post links as markdown: [Post Title](/posts/slug)
- Never use plain text URLs or HTML tags
- Never expose raw IDs or internal fields
- Keep responses concise and friendly
- IMPORTANT: The <posts> block above already contains ALL published posts. Use it directly instead of calling get_newest_posts unless the user asks to filter or search.
- NEVER use placeholder text like "Post Title" — always use the exact title field from the post data
- If you cannot find a real title, say "I couldn't retrieve the posts" instead
`.trim();
}

export async function POST(req: Request) {
    const { messages, tools: frontendToolDefs }: ChatRequest = await req.json();
    const model: LanguageModel = groq("llama-3.1-8b-instant");

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
                    search_posts: {
                        description: "Search blog posts by keyword, topic, or term name.",
                        inputSchema: z.object({
                            query: z.string().describe(
                                "The keyword or topic e.g. 'supabase', 'nextjs', 'authentication'"
                            ),
                        }),
                        execute: async ({ query }) => {
                            await writeStep(`Searching "${query}"...`);
                            const q = query.toLowerCase();
                            const matched = posts.filter(p =>
                                p.title.toLowerCase().includes(q) ||
                                (p.excerpt?.toLowerCase().includes(q) ?? false) ||
                                (p.keywords?.toLowerCase().includes(q) ?? false) ||
                                p.terms.some(t => t.name.toLowerCase().includes(q))
                            );
                            await writeStep(
                                matched.length > 0
                                    ? `Found ${matched.length} post${matched.length > 1 ? "s" : ""}`
                                    : `No posts found about "${query}"`
                            );
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
                            count: z.number().min(1).max(12).describe(
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
                    ...frontendTools ?? {},
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