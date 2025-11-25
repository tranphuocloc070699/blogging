import prisma from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { NextRequest } from 'next/server';
import { HEADER_AUTHORIZATION } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';

// GET /api/posts/slug/:slug - Get published post by slug
export async function GET(
  request: NextRequest, { params }: { params: Promise<{ slug: string }> }
) {

  const authorization = request.headers.get(HEADER_AUTHORIZATION);
  const user = getUserFromAuthHeader(authorization ?? "");
  const { slug } = await params;
  try {
    const userId = user?.userId;

    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        status: 'PUBLISHED',
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
      return notFoundResponse('Post not found');
    }

    // Check if the current user has liked this post
    let isLiked = false;
    if (userId) {

      const like = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: userId,
          },
        },
      });
      // console.log({ like })
      isLiked = !!like;
    }

    // Format the response
    const formattedPost = {
      ...serializeBigInt(post),
      terms: post.postTerms.map(pt => ({
        ...serializeBigInt(pt.term),
        taxonomy: serializeBigInt(pt.term.taxonomy),
      })),
      likesCount: post._count.likes,
      viewsCount: post._count.views,
      isLiked,
    };

    // Remove postTerms and _count from response
    delete (formattedPost as any).postTerms;
    delete (formattedPost as any)._count;

    return successResponse(formattedPost);
  } catch (error) {
    console.error('Get post by slug error:', error);
    return errorResponse('Failed to fetch post', 500);
  }
}
