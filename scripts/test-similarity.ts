// scripts/test-similarity.ts
import { generateEmbedding } from "@/lib/post-embedding";
import { postRepository } from "@/repositories/post.repository";

async function main() {
    const query = "AI";  // ← change this to test different topics
    console.log(`\n🔍 Searching for: "${query}"\n`);

    const embedding = await generateEmbedding(query);
    const results = await postRepository.searchPostsBySimilarity({
        queryEmbedding: embedding,
        limit: 5,
    });
    results.forEach((post, i) => {
        console.log(`${i + 1}. [${(post.similarity * 100).toFixed(1)}%] ${post.title}`);
    });
}

main();