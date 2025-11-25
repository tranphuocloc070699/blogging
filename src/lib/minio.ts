import * as Minio from 'minio';
import "@/lib/envConfig"
// MinIO client configuration
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "",
  port: Number(process.env.MINIO_PORT) || 443,
  useSSL: Boolean(process.env.MINIO_USE_SSL) || false,
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || "",
  // Use path-style URLs for better compatibility with reverse proxies
  pathStyle: true,
  // Add region
  region: process.env.region,
  // Disable signature V2 (use V4 only for better security and compatibility)
  // This is important when using reverse proxies like Cloudflare
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
    console.log(`Bucket ${MINIO_BUCKET} created successfully in region ${process.env.region}`);

    // Set bucket policy to allow public read access
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
    console.log(`Bucket ${MINIO_BUCKET} policy set to public read`);
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);

    // If it's a permission error or the bucket already exists, just log and continue
    // This allows uploads to work even if we can't manage the bucket
    const errorMessage = (error as Error).message || String(error);
    if (errorMessage.includes('already') || errorMessage.includes('exists')) {
      console.log(`Bucket ${MINIO_BUCKET} already exists (caught error)`);
      return;
    }

    // For other errors, throw
    throw error;
  }
}

// Upload file to MinIO
export async function uploadToMinio(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    await ensureBucketExists();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Upload file
    await minioClient.putObject(
      MINIO_BUCKET,
      uniqueFileName,
      file,
      file.length,
      {
        'Content-Type': contentType,
      }
    );

    // Return public URL
    const url = `${process.env.MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${uniqueFileName}`;
    return url;
  } catch (error) {
    console.error('Error uploading to MinIO:', error);
    throw error;
  }
}

// Delete file from MinIO
export async function deleteFromMinio(fileName: string): Promise<void> {
  try {
    await minioClient.removeObject(MINIO_BUCKET, fileName);
  } catch (error) {
    console.error('Error deleting from MinIO:', error);
    throw error;
  }
}
