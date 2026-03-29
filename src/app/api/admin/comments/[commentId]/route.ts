import { HEADER_AUTHORIZATION, USER_ROLE } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import prisma from "@/lib/prisma";
import { errorResponse, forbiddenResponse, notFoundResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

// DELETE /api/admin/comments/[commentId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user?.userId) return forbiddenResponse("Authentication required");
    if (user.role !== USER_ROLE.ADMIN) return forbiddenResponse("Admin only");

    const { commentId } = await params;
    const id = parseInt(commentId);

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return notFoundResponse("Comment not found");

    await prisma.comment.delete({ where: { id } });

    return successResponse(null, "Comment deleted");
  } catch (error) {
    console.error("Admin delete comment error:", error);
    return errorResponse("Failed to delete comment", 500);
  }
}
