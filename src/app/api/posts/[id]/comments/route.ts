import { HEADER_AUTHORIZATION, USER_ROLE } from "@/config/enums";
import { getUserFromAuthHeader } from "@/lib/auth.util";
import { buildReplyNotificationEmail } from "@/lib/email-templates";
import prisma from "@/lib/prisma";
import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/response";
import { NextRequest } from "next/server";
import { createTransport } from "nodemailer";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    const userId = user?.userId;

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
        likes: true,
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { id: true, username: true, email: true, role: true },
            },
            likes: true,
          },
        },
      },
    });

    const totalComments = await prisma.comment.count({ where: { postId } });

    const mapped = comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: {
        id: c.user.id,
        username: c.user.username,
        email: c.user.email,
        isAdmin: c.user.role === "ADMIN",
      },
      likesCount: c.likes.length,
      isLiked: userId ? c.likes.some((l) => l.userId === userId) : false,
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          username: r.user.username,
          email: r.user.email,
          isAdmin: r.user.role === "ADMIN",
        },
        likesCount: r.likes.length,
        isLiked: userId ? r.likes.some((l) => l.userId === userId) : false,
      })),
    }));

    return successResponse({ comments: mapped, totalComments });
  } catch (error) {
    console.error("Get comments error:", error);
    return errorResponse("Failed to get comments", 500);
  }
}

// POST /api/posts/[id]/comments - Create a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user?.userId) return forbiddenResponse("Authentication required");

    const { id } = await params;
    const postId = parseInt(id);
    const { content, parentId } = await request.json();

    if (!content?.trim()) return errorResponse("Content is required");

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return notFoundResponse("Post not found");

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: user.userId,
        content: content.trim(),
        parentId: parentId ?? null,
      },
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
    });

    // If admin is replying to someone else's comment, send notification email
    if (comment.user.role === USER_ROLE.ADMIN && parentId) {
      try {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          include: {
            user: { select: { id: true, username: true, email: true } },
          },
        });

        if (
          parentComment &&
          parentComment.user.email &&
          parentComment.user.id !== user.userId
        ) {
          const emailData = buildReplyNotificationEmail({
            recipientUsername: parentComment.user.username,
            adminUsername: comment.user.username,
            replyContent: comment.content,
            originalContent: parentComment.content,
            postTitle: post.title,
            postSlug: post.slug,
          });

          const transport = createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transport.sendMail({
            to: parentComment.user.email,
            from: process.env.SMTP_ADMIN_EMAIL,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
          });
        }
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error("Failed to send reply notification email:", emailError);
      }
    }

    // Invalidate cached post data so commentsCount reflects the new value
    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.postSlug(post.slug), "max");

    return successResponse(
      {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          email: comment.user.email,
          isAdmin: comment.user.role === USER_ROLE.ADMIN,
        },
        likesCount: 0,
        isLiked: false,
        replies: [],
      },
      "Comment created",
      201,
    );
  } catch (error) {
    console.error("Create comment error:", error);
    return errorResponse("Failed to create comment", 500);
  }
}
