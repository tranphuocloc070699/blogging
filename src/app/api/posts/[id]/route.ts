import { NextRequest } from 'next/server';
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '@/lib/response';
import { transformPostWithTaxonomies } from '@/lib/transformers/post-transformer';
import { HEADER_AUTHORIZATION, USER_ROLE } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';
import { postServerService } from '@/services/modules/post-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

export interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get post by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // Check for upsave query parameter
    const { searchParams } = new URL(request.url);
    const isUpsave = searchParams.get('upsave') === 'true';

    const post = await postServerService.getPostById(postId);

    if (!post) {
      return notFoundResponse('Post not found');
    }

    // If upsave=true, return simplified format for editing
    if (isUpsave) {
      const termIds = post.postTerms.map(pt => pt.termId);

      const upsaveResponse = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        thumbnail: post.thumbnail || undefined,
        termIds: termIds,
        status: post.status,
        keywords: post.keywords || '',
        publishedAt: post.publishedAt,

      };

      return successResponse(upsaveResponse);
    }

    // Transform post to group terms by taxonomy
    const transformedPost = transformPostWithTaxonomies(post);
    return successResponse(transformedPost);
  } catch (error) {
    console.error('Get post error:', error);
    captureApiRouteError(error, { method: "GET", route: "/api/posts/[id]" });
    return errorResponse('Failed to fetch post', 500);
  }
}

// PUT /api/posts/[id] - Update post (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    // if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');
    if (!user ) throw forbiddenResponse('Not authenticated');


    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();

    const {
      title,
      excerpt,
      content,
      slug,
      tableOfContents,
      status,
      termIds,
      thumbnail,
      keywords
    } = body;

    const { error, data: post } = await postServerService.updatePost(postId, {
      title,
      excerpt,
      content,
      slug,
      tableOfContents,
      status,
      termIds,
      thumbnail,
      keywords,
    });

    if (error === "NOT_FOUND") {
      return notFoundResponse('Post not found');
    }

    if (error === "DUPLICATE_SLUG") {
      return errorResponse('A post with this slug already exists', 409);
    }

    if (!post) {
      return errorResponse('Failed to update post', 500);
    }

    // Transform post to group terms by taxonomy
    const transformedPost = transformPostWithTaxonomies(post);
    return successResponse(transformedPost, 'Post updated successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Update post error:', error);
    captureApiRouteError(error, { method: "PUT", route: "/api/posts/[id]" });
    return errorResponse('Failed to update post', 500);
  }
}

// DELETE /api/posts/[id] - Delete post (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');


    const { id } = await params;
    const postId = parseInt(id);

    const { error } = await postServerService.deletePost(postId);
    if (error === "NOT_FOUND") {
      return notFoundResponse('Post not found');
    }

    return successResponse(null, 'Post deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete post error:', error);
    captureApiRouteError(error, { method: "DELETE", route: "/api/posts/[id]" });
    return errorResponse('Failed to delete post', 500);
  }
}
