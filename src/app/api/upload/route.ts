import { NextRequest, NextResponse } from "next/server";
import { uploadToMinio, type ImageUploadType } from "@/lib/minio";
import { verifyToken } from "@/lib/auth.util";
import { USER_ROLE } from "@/config/enums";
import { log } from "console";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 },
      );
    }

    // Extract and verify the token
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 },
      );
    }

    // Check if user is admin
    if (payload.role !== USER_ROLE.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden - Only admins can upload images" },
        { status: 403 },
      );
    }

    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const imageType = (formData.get("imageType") as ImageUploadType) || "post";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 20 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to MinIO with optimization
    const url = await uploadToMinio(buffer, file.name, file.type, imageType);

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
