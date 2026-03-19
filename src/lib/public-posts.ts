import "server-only";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { PostDashboardDto, PostDto } from "@/types/posts";

const PUBLIC_POSTS_PAGE_SIZE = 10;

export interface PublishedPostsPage {
  posts: PostDashboardDto[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

const getCachedPublishedPostsPage = unstable_cache(
  async (
    page: number,
    pageSize: number,
    search?: string,
    tag?: string,
  ): Promise<PublishedPostsPage> => {
    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tag) {
      where.postTerms = {
        some: {
          term: {
            slug: tag,
            taxonomy: {
              slug: "tag",
            },
          },
        },
      };
    }

    const skip = Math.max(0, page - 1) * pageSize;
    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          thumbnail: true,
          publishedAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
    ]);

    return {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        thumbnail: post.thumbnail,
        publishedAt: post.publishedAt,
        likesCount: post._count.likes,
        isLiked: false,
      })),
      hasMore: skip + posts.length < total,
      total,
      currentPage: page,
    };
  },
  ["public-posts-page"],
  { revalidate: 60 },
);

const getCachedPublishedPostBySlug = unstable_cache(
  async (slug: string): Promise<PostDto | null> => {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postTerms: {
          include: {
            term: {
              include: {
                taxonomy: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            views: true,
          },
        },
      },
    });

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
      terms: post.postTerms.map((postTerm) => ({
        id: postTerm.term.id,
        name: postTerm.term.name,
        slug: postTerm.term.slug,
        description: postTerm.term.description ?? undefined,
        taxonomy: {
          id: postTerm.term.taxonomy.id,
          name: postTerm.term.taxonomy.name,
          slug: postTerm.term.taxonomy.slug,
        },
        createdAt: postTerm.term.createdAt.toISOString(),
        updatedAt: postTerm.term.updatedAt.toISOString(),
      })),
      publishedAt: post.publishedAt,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      thumbnail: post.thumbnail,
      keywords: post.keywords ?? "",
      viewsCount: post._count.views,
      likesCount: post._count.likes,
      isLiked: false,
    };
  },
  ["public-post-by-slug"],
  { revalidate: 60 },
);

export async function getPublishedPostsPage(
  page = 1,
  search?: string,
  tag?: string,
  pageSize = PUBLIC_POSTS_PAGE_SIZE,
) {
  return getCachedPublishedPostsPage(page, pageSize, search, tag);
}

export async function getPublishedPostBySlug(slug: string, userId?: string) {
  const post = await getCachedPublishedPostBySlug(slug);

  if (!post) {
    return null;
  }

  if (!userId) {
    return post;
  }

  const like = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: post.id,
        userId: Number(userId),
      },
    },
    select: {
      id: true,
    },
  });

  return {
    ...post,
    isLiked: Boolean(like),
  };
}

export { PUBLIC_POSTS_PAGE_SIZE };
