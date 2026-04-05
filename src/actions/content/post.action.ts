"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "@/lib/cache-tags";
import { withMonitoredServerAction } from "@/lib/sentry-monitoring";
import {
  postRepository,
  type AdminPostListInput,
  type PostStatus,
  type PublishedPostListInput,
} from "@/repositories/post.repository";

const getCachedAdminPosts = unstable_cache(
  async (input: AdminPostListInput) => postRepository.findAdminPosts(input),
  ["posts-admin-list"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.posts, CACHE_TAGS.postsAdmin],
  },
);

const getCachedPostById = unstable_cache(
  async (id: number) => postRepository.findById(id),
  ["post-detail-by-id"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.posts],
  },
);

const getCachedPublishedPosts = unstable_cache(
  async (input: PublishedPostListInput) =>
    postRepository.findPublishedPosts(input),
  ["posts-published-list"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.posts],
  },
);

const getCachedPublishedPostBySlug = unstable_cache(
  async (slug: string) => postRepository.findPublishedBySlug(slug),
  ["post-detail-by-slug"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.posts],
  },
);

export async function getAdminPostsAction(input: AdminPostListInput) {
  return withMonitoredServerAction("post.getAdminPosts", async () =>
    getCachedAdminPosts(input),
  );
}

export async function getPostByIdAction(id: number) {
  return withMonitoredServerAction("post.getById", async () =>
    getCachedPostById(id),
  );
}

export async function getPublishedPostsAction(
  input: PublishedPostListInput,
  userId?: number,
) {
  return withMonitoredServerAction("post.getPublishedPosts", async () => {
    const { posts, totalElements, skip } = await getCachedPublishedPosts(input);
    const likedPostIds =
      userId && posts.length > 0
        ? await postRepository.findLikedPostIds(
            userId,
            posts.map((post) => post.id),
          )
        : new Set<number>();

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      thumbnail: post.thumbnail,
      publishedAt: post.publishedAt,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: likedPostIds.has(post.id),
      terms: post.postTerms.map((pt) => ({
        id: pt.term.id,
        name: pt.term.name,
        slug: pt.term.slug,
      })),
    }));

    return {
      posts: transformedPosts,
      hasMore: skip + posts.length < totalElements,
      total: totalElements,
      currentPage: input.page,
    };
  });
}

export async function getPublishedPostBySlugAction(
  slug: string,
  userId?: number,
) {
  return withMonitoredServerAction("post.getPublishedPostBySlug", async () => {
    const post = await getCachedPublishedPostBySlug(slug);
    if (!post) {
      return null;
    }

    const isLiked =
      userId !== undefined
        ? await postRepository.isLikedByUser(post.id, userId)
        : false;

    console.log({ isLiked, userId });

    return {
      ...post,
      terms: post.postTerms.map((pt) => ({
        ...pt.term,
        taxonomy: pt.term.taxonomy,
      })),
      likesCount: post._count.likes,
      viewsCount: post._count.views,
      commentsCount: post._count.comments,
      isLiked,
    };
  });
}

export async function createPostAction(input: {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  tableOfContents?: unknown;
  status: PostStatus;
  termIds?: number[];
  thumbnail?: string | null;
  keywords?: string | null;
  authorId: number;
  publishedAt?: Date | null;
}) {
  return withMonitoredServerAction("post.create", async () => {
    const existing = await postRepository.findBySlug(input.slug);
    if (existing) {
      return { error: "DUPLICATE_SLUG" as const, data: null };
    }

    const post = await postRepository.create(input);
    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postsAdmin, "max");
    revalidateTag(CACHE_TAGS.postSlug(post.slug), "max");
    return { error: null, data: post };
  });
}

export async function updatePostAction(
  id: number,
  input: {
    title?: string;
    excerpt?: string;
    content?: string;
    slug?: string;
    tableOfContents?: unknown;
    status?: PostStatus;
    termIds?: number[];
    thumbnail?: string | null;
    keywords?: string | null;
    publishedAt?: Date | null;
  },
) {
  return withMonitoredServerAction("post.update", async () => {
    const current = await postRepository.findById(id);
    if (!current) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    if (input.slug && input.slug !== current.slug) {
      const existing = await postRepository.findBySlug(input.slug);
      if (existing) {
        return { error: "DUPLICATE_SLUG" as const, data: null };
      }
    }

    const post = await postRepository.update(id, input);
    if (!post) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postsAdmin, "max");
    revalidateTag(CACHE_TAGS.postDetail(id), "max");
    revalidateTag(CACHE_TAGS.postSlug(current.slug), "max");
    revalidateTag(CACHE_TAGS.postSlug(post.slug), "max");
    return { error: null, data: post };
  });
}

export async function deletePostAction(id: number) {
  return withMonitoredServerAction("post.delete", async () => {
    const current = await postRepository.findById(id);
    if (!current) {
      return { error: "NOT_FOUND" as const };
    }

    await postRepository.delete(id);
    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postsAdmin, "max");
    revalidateTag(CACHE_TAGS.postDetail(id), "max");
    revalidateTag(CACHE_TAGS.postSlug(current.slug), "max");
    return { error: null };
  });
}

export async function publishPostAction(id: number) {
  return withMonitoredServerAction("post.publish", async () => {
    const post = await postRepository.publish(id);
    if (!post) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postsAdmin, "max");
    revalidateTag(CACHE_TAGS.postDetail(id), "max");
    revalidateTag(CACHE_TAGS.postSlug(post.slug), "max");
    return { error: null, data: post };
  });
}

export async function unpublishPostAction(id: number) {
  return withMonitoredServerAction("post.unpublish", async () => {
    const post = await postRepository.unpublish(id);
    if (!post) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postsAdmin, "max");
    revalidateTag(CACHE_TAGS.postDetail(id), "max");
    revalidateTag(CACHE_TAGS.postSlug(post.slug), "max");
    return { error: null, data: post };
  });
}
