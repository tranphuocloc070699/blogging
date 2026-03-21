export const CACHE_TTL_SECONDS = 120;

export const CACHE_TAGS = {
  posts: "posts",
  postsAdmin: "posts:admin",
  postDetail: (id: number) => `post:${id}`,
  postSlug: (slug: string) => `post:slug:${slug}`,
  terms: "terms",
  termDetail: (id: number) => `term:${id}`,
  taxonomies: "taxonomies",
  taxonomyDetail: (id: number) => `taxonomy:${id}`,
} as const;

