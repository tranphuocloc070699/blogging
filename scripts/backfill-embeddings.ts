// scripts/backfill-embeddings.ts
import prisma from "@/lib/prisma";
import { postRepository } from "@/repositories/post.repository"
async function main() {
    const posts = await prisma.$queryRaw<{ id: number }[]>`
        SELECT id FROM posts
        WHERE status = 'PUBLISHED'
        AND embedding IS NULL
    `;

    console.log(`Backfilling ${posts.length} posts...`);

    for (const post of posts) {
        await postRepository.upsertPostEmbedding(post.id);
        console.log(`✅ Embedded post ${post.id}`);
    }
}

main();