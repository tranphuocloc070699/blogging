import { Post, PostTerm, Term, Taxonomy } from '@prisma/client';

/**
 * Type definitions for transformed post data
 */
export interface TaxonomyWithTerms {
  id: number;
  name: string;
  slug: string;
  terms: TermSummary[];
}

export interface TermSummary {
  id: number;
  name: string;
  slug: string;
}

export interface PostWithTaxonomies extends Omit<Post, 'postTerms'> {
  taxonomies: TaxonomyWithTerms[];
  author?: {
    id: number;
    username: string;
    email?: string | null;
  };
}


/**
 * Type for taxonomy summary (only fields we actually need)
 */
export type TaxonomySummary = Pick<Taxonomy, 'id' | 'name' | 'slug'>;

/**
 * Type for raw Prisma query result with nested includes
 */
export type PostWithRelations = Post & {
  postTerms: (PostTerm & {
    term: Term & {
      taxonomy: TaxonomySummary;
    };
  })[];
  author?: {
    id: number;
    username: string;
    email?: string | null;
  };
};

/**
 * Transforms a post with nested PostTerm relations into a grouped taxonomy structure
 *
 * Input (Prisma result):
 * {
 *   id: 1,
 *   title: "My Post",
 *   postTerms: [
 *     { term: { id: 1, name: "JavaScript", slug: "javascript", taxonomy: { id: 1, name: "Tags", slug: "tags" } } },
 *     { term: { id: 2, name: "Prisma", slug: "prisma", taxonomy: { id: 1, name: "Tags", slug: "tags" } } },
 *     { term: { id: 3, name: "Tutorial", slug: "tutorial", taxonomy: { id: 2, name: "Categories", slug: "categories" } } }
 *   ]
 * }
 *
 * Output:
 * {
 *   id: 1,
 *   title: "My Post",
 *   taxonomies: [
 *     {
 *       id: 1,
 *       name: "Tags",
 *       slug: "tags",
 *       terms: [
 *         { id: 1, name: "JavaScript", slug: "javascript" },
 *         { id: 2, name: "Prisma", slug: "prisma" }
 *       ]
 *     },
 *     {
 *       id: 2,
 *       name: "Categories",
 *       slug: "categories",
 *       terms: [
 *         { id: 3, name: "Tutorial", slug: "tutorial" }
 *       ]
 *     }
 *   ]
 * }
 *
 * @param post - Post with nested postTerms including term and taxonomy relations
 * @returns Post with taxonomies grouped and formatted
 */
export function transformPostWithTaxonomies(
  post: PostWithRelations
): PostWithTaxonomies {
  // Group terms by taxonomy
  const taxonomyMap = new Map<number, TaxonomyWithTerms>();

  for (const postTerm of post.postTerms) {
    const { term } = postTerm;
    const { taxonomy } = term;

    // Get or create taxonomy entry
    if (!taxonomyMap.has(taxonomy.id)) {
      taxonomyMap.set(taxonomy.id, {
        id: taxonomy.id,
        name: taxonomy.name,
        slug: taxonomy.slug,
        terms: [],
      });
    }

    // Add term to taxonomy
    const taxonomyEntry = taxonomyMap.get(taxonomy.id)!;
    taxonomyEntry.terms.push({
      id: term.id,
      name: term.name,
      slug: term.slug,
    });
  }

  // Convert map to array and sort by taxonomy name
  const taxonomies = Array.from(taxonomyMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Remove postTerms and add taxonomies
  const { postTerms, ...postWithoutRelations } = post;

  return {
    ...postWithoutRelations,
    taxonomies,
    author: post.author,
  };
}

/**
 * Transforms multiple posts with their taxonomy relationships
 *
 * @param posts - Array of posts with nested relations
 * @returns Array of transformed posts
 */
export function transformPostsWithTaxonomies(
  posts: PostWithRelations[]
): PostWithTaxonomies[] {
  return posts.map(transformPostWithTaxonomies);
}
