import { HEADER_AUTHORIZATION, USER_ROLE } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import prisma from "@/lib/prisma";
import { errorResponse, forbiddenResponse, successResponse } from "@/lib/response";
import { NextRequest } from "next/server";

// GET /api/admin/comments - List all comments (admin only)
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user?.userId) return forbiddenResponse("Authentication required");
    if (user.role !== USER_ROLE.ADMIN) return forbiddenResponse("Admin only");

    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, email: true } },
        post: { select: { id: true, slug: true, title: true } },
        _count: { select: { likes: true } },
      },
    });

    const mapped = comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      postId: c.postId,
      postSlug: c.post.slug,
      postTitle: c.post.title,
      parentId: c.parentId,
      user: c.user,
      likesCount: c._count.likes,
    }));

    return successResponse(mapped);
  } catch (error) {
    console.error("Admin get comments error:", error);
    return errorResponse("Failed to get comments", 500);
  }
}
