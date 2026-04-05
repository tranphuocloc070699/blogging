import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type PostStatus = "DRAFT" | "PUBLISHED";

export interface AdminPostListInput {
  page: number;
  size: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  status?: PostStatus | null;
  keyword?: string | null;
}

export interface PublishedPostListInput {
  page: number;
  size: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  search?: string | null;
  tag?: string | null;
}

const postInclude = {
  author: {
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
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
} satisfies Prisma.PostInclude;

export const postRepository = {
  async findAdminPosts(input: AdminPostListInput) {
    const where: Prisma.PostWhereInput = {};
    if (input.status) {
      where.status = input.status;
    }

    if (input.keyword) {
      where.OR = [
        { title: { contains: input.keyword, mode: "insensitive" } },
        { content: { contains: input.keyword, mode: "insensitive" } },
        { excerpt: { contains: input.keyword, mode: "insensitive" } },
      ];
    }

    const [totalElements, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip: input.page * input.size,
        take: input.size,
        orderBy: { [input.sortBy]: input.sortDir },
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      }),
    ]);

    return { posts, totalElements };
  },

  async create(data: {
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
    return prisma.post.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        slug: data.slug,
        ...(data.tableOfContents !== undefined
          ? { tableOfContents: data.tableOfContents as Prisma.InputJsonValue }
          : {}),
        status: data.status,
        authorId: data.authorId,
        publishedAt: data.publishedAt !== undefined ? data.publishedAt : (data.status === "PUBLISHED" ? new Date() : null),
        thumbnail: data.thumbnail,
        keywords: data.keywords,
        ...(data.termIds && data.termIds.length > 0
          ? {
              postTerms: {
                create: data.termIds.map((termId) => ({ termId })),
              },
            }
          : {}),
      },
      include: postInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
  },

  async findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
  },

  async update(
    id: number,
    data: {
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
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return prisma.$transaction(async (tx) => {
      if (data.termIds !== undefined) {
        await tx.postTerm.deleteMany({ where: { postId: id } });
      }

      return tx.post.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
          ...(data.content !== undefined ? { content: data.content } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.tableOfContents !== undefined
            ? { tableOfContents: data.tableOfContents as Prisma.InputJsonValue }
            : {}),
          ...(data.thumbnail !== undefined
            ? { thumbnail: data.thumbnail }
            : {}),
          ...(data.keywords !== undefined ? { keywords: data.keywords } : {}),
          ...(data.status !== undefined
            ? {
                status: data.status,
                ...(data.publishedAt !== undefined
                  ? { publishedAt: data.publishedAt }
                  : data.status === "PUBLISHED" && existing.status !== "PUBLISHED"
                    ? { publishedAt: new Date() }
                    : {}),
              }
            : data.publishedAt !== undefined
              ? { publishedAt: data.publishedAt }
              : {}),
          ...(data.termIds !== undefined && data.termIds.length > 0
            ? {
                postTerms: {
                  create: data.termIds.map((termId) => ({ termId })),
                },
              }
            : {}),
        },
        include: postInclude,
      });
    });
  },

  async delete(id: number) {
    return prisma.post.delete({ where: { id } });
  },

  async publish(id: number) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    return prisma.post.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: existing.publishedAt || new Date(),
      },
      include: postInclude,
    });
  },

  async unpublish(id: number) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    return prisma.post.update({
      where: { id },
      data: { status: "DRAFT" },
      include: postInclude,
    });
  },

  async findPublishedPosts(input: PublishedPostListInput) {
    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };

    if (input.search) {
      where.OR = [
        { title: { contains: input.search, mode: "insensitive" } },
        { excerpt: { contains: input.search, mode: "insensitive" } },
      ];
    }

    if (input.tag) {
      where.postTerms = {
        some: {
          term: {
            slug: input.tag,
            taxonomy: {
              slug: "tag",
            },
          },
        },
      };
    }

    const skip = (input.page - 1) * input.size;
    const [totalElements, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: input.size,
        orderBy: { [input.sortBy]: input.sortDir },
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          thumbnail: true,
          publishedAt: true,
          postTerms: {
            select: {
              term: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  taxonomy: { select: { slug: true } },
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              views: true,
              comments: true,
            },
          },
        },
      }),
    ]);

    return { posts, totalElements, skip };
  },

  async findPublishedBySlug(slug: string) {
    return prisma.post.findFirst({
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
            comments: true,
          },
        },
      },
    });
  },

  async findLikedPostIds(userId: number, postIds: number[]) {
    const likes = await prisma.postLike.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });

    return new Set(likes.map((like) => like.postId));
  },

  async isLikedByUser(postId: number, userId: number) {
    const like = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return Boolean(like);
  },
};
