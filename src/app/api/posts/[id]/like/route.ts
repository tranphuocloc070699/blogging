import { getAuthUser, requireAuth } from "@/lib/middleware";
import { RouteParams } from "../route";
import prisma from "@/lib/prisma";
import { errorResponse, forbiddenResponse, notFoundResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

// PUT /api/posts/[id]/like - Toggle like post
export async function PUT(_ : NextRequest, { params }: RouteParams) {
        try {
                await requireAuth();

                const { id } = await params;
                const postId = parseInt(id);
                const authUser = await getAuthUser();
                const userId = authUser?.userId;
            
  if (!userId) {
                        return forbiddenResponse('UserId not found');
                }


                // Check if post exists
                const existingPost = await prisma.post.findUnique({
                        where: { id: postId },
                });

                if (!existingPost) {
                        return notFoundResponse('Post not found');
                }


                // Check if user has already liked this post
                const existingLike = await prisma.postLike.findUnique({
                        where: {
                                postId_userId: {
                                        userId,
                                        postId,
                                },
                        },
                });

                let isLiked: boolean;
                let likesCount: number;

                if (existingLike) {
                        // Unlike: Remove the like
                        await prisma.postLike.delete({
                                where: {
                                        id: existingLike.id,
                                },
                        });
                        isLiked = false;
                } else {
                        // Like: Create a new like
                        await prisma.postLike.create({
                                data: {
                                        postId,
                                        userId,
                                },
                        });
                        isLiked = true;
                }

                // Get updated likes count
                likesCount = await prisma.postLike.count({
                        where: { postId },
                });

                return successResponse(
                        {
                                isLiked,
                                likesCount,
                        },
                        isLiked ? 'Post liked successfully' : 'Post unliked successfully'
                );
        } catch (error) {
                // If it's already a Response (from middleware), return it
                if (error instanceof Response) {
                        return error;
                }
                console.error('Toggle like error:', error);
                return errorResponse('Failed to toggle like', 500);
        }
}
