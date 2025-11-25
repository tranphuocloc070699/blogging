import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { Prisma } from '@prisma/client';
import { HEADER_AUTHORIZATION } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';

// GET /api/posts/published - Get published posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const authorization = request.headers.get(HEADER_AUTHORIZATION);



    const user = getUserFromAuthHeader(authorization ?? "");
    const userId = user?.userId;

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const size = parseInt(searchParams.get('size') || pageSize.toString());
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const search = searchParams.get('search'); // Search in both title and excerpt
    const tag = searchParams.get('tag'); // Filter by tag slug

    // Build where clause
    const where: Prisma.PostWhereInput = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    };

    // Search by title or excerpt
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }


    // Filter by tag (term with Tag taxonomy)
    if (tag) {
      where.postTerms = {
        some: {
          term: {
            slug: tag,
            taxonomy: {
              slug: 'tag', // Only filter by terms from Tag taxonomy
            },
          },
        },
      };
    }
    const skip = (page - 1) * size;




    // Get total count and posts in parallel
    const [totalElements, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: size,
        orderBy: { [sortBy]: sortDir },
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
                  taxonomy: {
                    select: {
                      slug: true,
                    },
                  },
                },
              },
            },
            // where: {
            //   term: {
            //     taxonomy: {
            //       slug: 'tag',
            //     },
            //   },
            // },
          },
          _count: {
          select: {
            likes: true,
            views: true,
          },
        },
        },
      })
    ]);



    // Check which posts are liked by the current user (if authenticated)
    let likedPostIds: Set<number> = new Set();
    if (userId) {
      const postIds = posts.map(p => p.id);
      const likes = await prisma.postLike.findMany({
        where: {
          userId: userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      });
      likedPostIds = new Set(likes.map(like => like.postId));
    }

    // Transform posts to include terms array, likes count, and isLiked status
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      thumbnail: post.thumbnail,
      publishedAt: post.publishedAt,
      likesCount: post._count.likes,
      isLiked: likedPostIds.has(post.id),
      terms: post.postTerms.map(pt => ({
        id: pt.term.id,
        name: pt.term.name,
        slug: pt.term.slug,
      })),
    }));

    const hasMore = skip + posts.length < totalElements;

    return successResponse({
      posts: transformedPosts,
      hasMore,
      total: totalElements,
      currentPage: page,
    });
  } catch (error) {
    console.error('Get published posts error:', error);
    return errorResponse('Failed to fetch published posts', 500);
  }
}
