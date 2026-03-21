import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import { postServerService } from '@/services/modules/post-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/posts/[id]/unpublish - Unpublish a post (Admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const postId = parseInt(id);

    const { error, data: post } = await postServerService.unpublishPost(postId);
    if (error === "NOT_FOUND") {
      return notFoundResponse('Post not found');
    }
    if (!post) {
      return errorResponse('Failed to unpublish post', 500);
    }

    // Convert to number for JSON serialization
    const postResponse = {
      ...post,
      id: Number(post.id),
      authorId: Number(post.authorId),
      author: {
        ...post.author,
        id: Number(post.author.id),
      },
      postTerms: post.postTerms.map(pt => ({
        postId: Number(pt.postId),
        termId: Number(pt.termId),
        term: {
          ...pt.term,
          id: Number(pt.term.id),
          taxonomyId: Number(pt.term.taxonomyId),
          taxonomy: {
            ...pt.term.taxonomy,
            id: Number(pt.term.taxonomy.id),
          },
        },
      })),
    };

    return successResponse(postResponse, 'Post unpublished successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Unpublish post error:', error);
    captureApiRouteError(error, { method: "PATCH", route: "/api/posts/[id]/unpublish" });
    return errorResponse('Failed to unpublish post', 500);
  }
}
