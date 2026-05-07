import prisma from "@/lib/prisma"
import { embed } from "ai"
import { openai } from "@ai-sdk/openai"
import { log } from "console"


interface IBuildPostText {
    title: string;
    excerpt?: string | null,
    content: string;
    keywords?: string | null;
    terms?: string[];
}

export function extractTextFromTiptap(json: string): string {
    try {
        const doc = JSON.parse(json);
        const texts: string[] = [];

        function walk(node: any) {
            if (node.type === "text" && node.text) {
                texts.push(node.text);
            }
            if (node.content) {
                node.content.forEach(walk);
            }
        }

        walk(doc);
        return texts.join(" ");
    } catch {
        return json; // fallback to raw if parsing fails
    }
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: text
    })
    return embedding
}



export function buildPostText(post: IBuildPostText) {
    const MAX_CHAR = 6000;
    const plainContent = extractTextFromTiptap(post.content).slice(0, MAX_CHAR);

    return [
        `Title: ${post.title}`,
        post.excerpt ? `Excerpt: ${post.excerpt}` : "",
        post.keywords ? `Keywords: ${post.keywords}` : "",
        post.terms?.length ? `Tags: ${post.terms.join(", ")}` : "",
        `Content: ${plainContent}`,
    ].filter(Boolean).join("\n");
}



