import { NextRequest } from 'next/server';
import { successResponse, errorResponse, paginatedResponse, forbiddenResponse } from '@/lib/response';
import { transformPostWithTaxonomies } from '@/lib/transformers/post-transformer';
import { HEADER_AUTHORIZATION } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';
import { postServerService } from '@/services/modules/post-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

// Valid post statuses (matching database check constraint)
type PostStatus = 'DRAFT' | 'PUBLISHED';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Retrieve all posts with filtering, pagination and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (zero-based)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *         description: Filter by post status
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (searches in title, content, and excerpt)
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         content:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const status = searchParams.get('status') as PostStatus | null;
    const keyword = searchParams.get('keyword');

    const { posts, totalElements } = await postServerService.getAllPosts({
      page,
      size,
      sortBy,
      sortDir: sortDir as "asc" | "desc",
      status: status ?? undefined,
      keyword: keyword ?? undefined,
    });

    const totalPages = Math.ceil(totalElements / size);

    return paginatedResponse(
      posts,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Posts retrieved successfully'
    );
  } catch (error) {
    console.error('Get posts error:', error);
    captureApiRouteError(error, { method: "GET", route: "/api/posts" });
    return errorResponse('Failed to fetch posts', 500);
  }
}


export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    // if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');
    if (!user ) throw forbiddenResponse('Not authenticated');


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
      keywords,
      publishedAt,
    } = body;

    // Validation
    if (!title || !excerpt || !content || !slug || !status) {
      return errorResponse('Title, excerpt, content, slug, and status are required');
    }

    // Create post with terms
    const { error, data: post } = await postServerService.createPost(user.userId, {
      title,
      excerpt,
      content,
      slug,
      tableOfContents,
      status,
      termIds,
      thumbnail,
      keywords,
      publishedAt: publishedAt ?? undefined,
    });

    if (error === "DUPLICATE_SLUG") {
      return errorResponse('A post with this slug already exists', 409);
    }

    if (!post) {
      return errorResponse('Failed to create post', 500);
    }

    // Transform post to group terms by taxonomy
    const transformedPost = transformPostWithTaxonomies(post as any);
    return successResponse(transformedPost, 'Post created successfully', 201);
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create post error:', error);
    captureApiRouteError(error, { method: "POST", route: "/api/posts" });
    return errorResponse('Failed to create post', 500);
  }
}
