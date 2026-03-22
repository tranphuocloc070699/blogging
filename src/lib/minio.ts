import * as Minio from "minio";
import sharp from "sharp";
import "@/lib/envConfig";

// MinIO client configuration - lazy initialization to avoid build-time errors
let _minioClient: Minio.Client | null = null;

function getMinioClient(): Minio.Client {
  if (!_minioClient) {
    // Provide dummy values during build time when env vars are not available
    const endPoint = process.env.MINIO_ENDPOINT || "localhost";
    const port = Number(process.env.MINIO_PORT) || 9000;
    const useSSL = process.env.MINIO_USE_SSL === "true";
    const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
    const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";

    _minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
      // Use path-style URLs for better compatibility with reverse proxies
      pathStyle: true,
      // Add region
      region: process.env.region,
      // Disable signature V2 (use V4 only for better security and compatibility)
      // This is important when using reverse proxies like Cloudflare
    });
  }
  return _minioClient;
}

// Export a getter instead of the client directly
export const minioClient = new Proxy({} as Minio.Client, {
  get: (target, prop) => {
    const client = getMinioClient();
    return (client as any)[prop];
  },
});

// Bucket name for blog images
export const MINIO_BUCKET = process.env.MINIO_BUCKET || "";

// Ensure bucket exists
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET);

    if (exists) {
      console.log(`Bucket ${MINIO_BUCKET} already exists`);
      return;
    }

    // Create bucket with region
    await minioClient.makeBucket(MINIO_BUCKET, process.env.region);
    console.log(
      `Bucket ${MINIO_BUCKET} created successfully in region ${process.env.region}`,
    );

    // Set bucket policy to allow public read access
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
    console.log(`Bucket ${MINIO_BUCKET} policy set to public read`);
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);

    // If it's a permission error or the bucket already exists, just log and continue
    // This allows uploads to work even if we can't manage the bucket
    const errorMessage = (error as Error).message || String(error);
    if (errorMessage.includes("already") || errorMessage.includes("exists")) {
      console.log(`Bucket ${MINIO_BUCKET} already exists (caught error)`);
      return;
    }

    // For other errors, throw
    throw error;
  }
}

export type ImageUploadType = "thumbnail" | "post";

// Optimize image with sharp before upload
// Stack: resize → strip metadata → colorspace → quantization → subsampling → entropy coding
async function optimizeImage(
  buffer: Buffer,
  type: ImageUploadType,
): Promise<{ buffer: Buffer; contentType: string }> {
  console.log(
    `[optimizeImage] Start — type=${type}, inputSize=${buffer.length} bytes`,
  );

  let pipeline = sharp(buffer);
  console.log(`[optimizeImage] Sharp instance created`);

  pipeline = pipeline.toColorspace("srgb");
  console.log(`[optimizeImage] Colorspace configured`);

  if (type === "thumbnail") {
    pipeline = pipeline.resize(168, 190, {
      fit: "cover",
      position: "attention",
    });
    console.log(`[optimizeImage] Resize configured — 168×190 cover`);
  } else {
    pipeline = pipeline.resize(768, undefined, {
      fit: "inside",
      withoutEnlargement: true,
    });
    console.log(`[optimizeImage] Resize configured — 768px inside`);
  }

  console.log(`[optimizeImage] Starting AVIF encoding...`);
  const start = Date.now();

  const optimized = await pipeline
    .avif({
      quality: 60,
      effort: 9, // ← likely culprit for timeout
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();

  console.log(
    `[optimizeImage] AVIF encoding done — ${Date.now() - start}ms, outputSize=${optimized.length} bytes`,
  );

  return { buffer: optimized, contentType: "image/avif" };
}
// Upload file to MinIO
export async function uploadToMinio(
  file: Buffer,
  fileName: string,
  imageType: ImageUploadType = "post",
): Promise<string> {
  try {
    await ensureBucketExists();

    // Optimize image before upload
    const { buffer: optimized, contentType: optimizedContentType } =
      await optimizeImage(file, imageType);

    // Generate unique filename with timestamp, always .avif after optimization
    const timestamp = Date.now();
    const baseName = fileName.replace(/\.[^.]+$/, "");
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(7)}-${baseName}.avif`;

    // Upload optimized file
    await minioClient.putObject(
      MINIO_BUCKET,
      uniqueFileName,
      optimized,
      optimized.length,
      {
        "Content-Type": optimizedContentType,
      },
    );

    // Return public URL
    const url = `${process.env.MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${uniqueFileName}`;
    return url;
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
}

// Delete file from MinIO
export async function deleteFromMinio(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(MINIO_BUCKET, fileName);
  } catch (error) {
    console.error("Error deleting from MinIO:", error);
    throw error;
  }
}
