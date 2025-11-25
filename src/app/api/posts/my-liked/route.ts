import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { HEADER_AUTHORIZATION } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";

/**
 * @swagger
 * /api/posts/my-liked:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts that the current user has liked
 *     description: Retrieves a list of posts that the authenticated user has liked
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
 *         description: Successfully retrieved liked posts
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
	// const authResult = (request);
	// if (authResult instanceof Response) return authResult;

const authorization = request.headers.get(HEADER_AUTHORIZATION);
	const user = getUserFromAuthHeader(authorization ?? "");
	try {
		const userId = user?.userId
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const size = parseInt(searchParams.get('size') || '10');
		const skip = (page - 1) * size;

		// Get total count of liked posts
		const total = await prisma.postLike.count({
			where: { userId },
		});

		// Get liked posts with post details
		const likedPosts = await prisma.postLike.findMany({
			where: { userId },
			include: {
				post: {
					include: {
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
				likedAt: 'desc',
			},
			skip,
			take: size,
		});

		// Transform the data to match post structure
		const posts = likedPosts.map((like) => ({
			...like.post,
			likedAt: like.likedAt,
			likesCount: like.post._count.likes,
			viewsCount: like.post._count.views,
			isLiked: true,
		}));
		const hasMore = skip + size < total;

		return successResponse(
			{
				posts,
				hasMore,
				total,
				currentPage: page,
			},
			'Liked posts retrieved successfully'
		);
	} catch (error) {
		console.error('Get liked posts error:', error);
		return errorResponse('Failed to retrieve liked posts', 500);
	}
}
