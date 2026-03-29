import { HEADER_AUTHORIZATION } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import prisma from "@/lib/prisma";
import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/response";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ id: string; commentId: string }>;
}

// PUT /api/posts/[id]/comments/[commentId]/like - Toggle comment like
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user?.userId) return forbiddenResponse("Authentication required");

    const { commentId } = await params;
    const commentIdInt = parseInt(commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentIdInt },
    });
    if (!comment) return notFoundResponse("Comment not found");

    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId: commentIdInt, userId: user.userId } },
    });

    let isLiked: boolean;
    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
      isLiked = false;
    } else {
      await prisma.commentLike.create({
        data: { commentId: commentIdInt, userId: user.userId },
      });
      isLiked = true;
    }

    const likesCount = await prisma.commentLike.count({
      where: { commentId: commentIdInt },
    });

    return successResponse(
      { isLiked, likesCount },
      isLiked ? "Comment liked" : "Comment unliked"
    );
  } catch (error) {
    console.error("Toggle comment like error:", error);
    return errorResponse("Failed to toggle like", 500);
  }
}
