import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { hashPassword } from "@/lib/auth.util";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) return errorResponse("Token and password are required");
    if (password.length < 6) return errorResponse("Password must be at least 6 characters");

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.expires < new Date()) {
      return errorResponse("Invalid or expired reset link", 400);
    }

    const user = await prisma.user.findUnique({ where: { email: resetToken.email } });
    if (!user) return errorResponse("User not found", 404);

    const hashed = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return successResponse(null, "Password reset successfully.");
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse("Failed to reset password", 500);
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return errorResponse("Token is required");

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.expires < new Date()) {
    return errorResponse("Invalid or expired reset link", 400);
  }

  return successResponse({ email: resetToken.email }, "Token is valid");
}
