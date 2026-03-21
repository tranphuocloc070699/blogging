import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { NextRequest } from 'next/server';
import { HEADER_AUTHORIZATION } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';
import { postServerService } from '@/services/modules/post-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

// GET /api/posts/slug/:slug - Get published post by slug
export async function GET(
  request: NextRequest, { params }: { params: Promise<{ slug: string }> }
) {

  const authorization = request.headers.get(HEADER_AUTHORIZATION);
  const user = getUserFromAuthHeader(authorization ?? "");
  const { slug } = await params;
  try {
    const userId = user?.userId;

    const post = await postServerService.getPostBySlug(slug, userId);

    if (!post) {
      return notFoundResponse('Post not found');
    }

    // Format the response
    const formattedPost = {
      ...serializeBigInt(post),
      terms: post.terms.map(term => ({
        ...serializeBigInt(term),
        taxonomy: serializeBigInt(term.taxonomy),
      })),
      likesCount: post.likesCount,
      viewsCount: post.viewsCount,
      isLiked: post.isLiked,
    };

    delete (formattedPost as any).postTerms;
    delete (formattedPost as any)._count;

    return successResponse(formattedPost);
  } catch (error) {
    console.error('Get post by slug error:', error);
    captureApiRouteError(error, { method: "GET", route: "/api/posts/slug/[slug]" });
    return errorResponse('Failed to fetch post', 500);
  }
}
