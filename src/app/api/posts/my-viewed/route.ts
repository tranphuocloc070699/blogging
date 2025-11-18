import { requireAuth } from "@/lib/middleware";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

/**
 * @swagger
 * /api/posts/my-viewed:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts that the current user has viewed
 *     description: Retrieves a list of posts that the authenticated user has already viewed
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved viewed posts
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
	try {
		const authResult = await requireAuth();
		const userId = authResult.userId;
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const size = parseInt(searchParams.get('size') || '10');
		const skip = (page - 1) * size;

		// Get total count of viewed posts
		const total = await prisma.postView.count({
			where: { userId },
		});

		// Get viewed posts with post details
		const viewedPosts = await prisma.postView.findMany({
			where: { userId },
			include: {
				post: {
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
										taxonomy: true,
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
				},
			},
			orderBy: {
				viewedAt: 'desc',
			},
			skip,
			take: size,
		});

		// Transform the data to match post structure
		const posts = viewedPosts.map((view) => ({
			...view.post,
			viewedAt: view.viewedAt,
			likesCount: view.post._count.likes,
			viewsCount: view.post._count.views,
		}));

		const hasMore = skip + size < total;

		return successResponse(
			{
				posts,
				hasMore,
				total,
				currentPage: page,
			},
			'Viewed posts retrieved successfully'
		);
	} catch (error) {
		// If it's already a Response (from middleware), return it
		if (error instanceof Response) {
			return error;
		}
		console.error('Get viewed posts error:', error);
		return errorResponse('Failed to retrieve viewed posts', 500);
	}
}
