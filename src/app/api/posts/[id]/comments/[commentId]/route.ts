import { HEADER_AUTHORIZATION, USER_ROLE } from "@/config/enums";
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

// DELETE /api/posts/[id]/comments/[commentId] - Delete a comment (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user?.userId) return forbiddenResponse("Authentication required");
    if (user.role !== USER_ROLE.ADMIN) return forbiddenResponse("Admin only");

    const { commentId } = await params;
    const commentIdInt = parseInt(commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentIdInt },
    });
    if (!comment) return notFoundResponse("Comment not found");

    await prisma.comment.delete({ where: { id: commentIdInt } });

    return successResponse(null, "Comment deleted");
  } catch (error) {
    console.error("Delete comment error:", error);
    return errorResponse("Failed to delete comment", 500);
  }
}
