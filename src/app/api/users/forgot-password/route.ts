import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";
import { buildForgotPasswordEmail } from "@/lib/email-templates";
import crypto from "crypto";
import { createTransport } from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return errorResponse("Email is required");

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) {
      return successResponse(null, "If this email exists, a reset link has been sent.");
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailData = buildForgotPasswordEmail({ email, resetUrl });

    await transport.sendMail({
      to: email,
      from: process.env.SMTP_ADMIN_EMAIL,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    return successResponse(null, "If this email exists, a reset link has been sent.");
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse("Failed to send reset email", 500);
  }
}
