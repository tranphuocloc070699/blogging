import "server-only";

import {
  getPublishedPostBySlugAction,
  getPublishedPostsAction,
} from "@/actions/content/post.action";
import type { PostDashboardDto, PostDto } from "@/types/posts";

const PUBLIC_POSTS_PAGE_SIZE = 10;

export interface PublishedPostsPage {
  posts: PostDashboardDto[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

const toIsoString = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date(0).toISOString();
};

export async function getPublishedPostsPage(
  page = 1,
  search?: string,
  tag?: string,
  pageSize = PUBLIC_POSTS_PAGE_SIZE,
) {
  const data = await getPublishedPostsAction({
    page,
    size: pageSize,
    sortBy: "publishedAt",
    sortDir: "desc",
    search,
    tag,
  });

  return {
    ...data,
    posts: data.posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      thumbnail: post.thumbnail ?? null,
      publishedAt: post.publishedAt,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      isLiked: post.isLiked,
    })),
  };
}

export async function getPublishedPostBySlug(slug: string, userId?: number) {
  const post = await getPublishedPostBySlugAction(
    slug,
    userId,
  );

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    slug: post.slug,
    tableOfContents:
      (post.tableOfContents as unknown as PostDto["tableOfContents"]) ??
      undefined,
    status: post.status as PostDto["status"],
    author: {
      id: post.author.id,
      name: post.author.username,
      avatar: undefined,
    },
    terms: post.terms.map((term) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
      description: term.description ?? undefined,
      taxonomy: {
        id: term.taxonomy.id,
        name: term.taxonomy.name,
        slug: term.taxonomy.slug,
      },
      createdAt: toIsoString(term.createdAt),
      updatedAt: toIsoString(term.updatedAt),
    })),
    publishedAt: post.publishedAt,
    createdAt: toIsoString(post.createdAt),
    updatedAt: toIsoString(post.updatedAt),
    thumbnail: post.thumbnail,
    keywords: post.keywords ?? "",
    viewsCount: post.viewsCount,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: post.isLiked,
  } satisfies PostDto;
}

export { PUBLIC_POSTS_PAGE_SIZE };
