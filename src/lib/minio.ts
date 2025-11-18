import * as Minio from 'minio';

// MinIO client configuration
export const minioClient = new Minio.Client({
  endPoint: process.env["MINIO_ENDPOINT"] || 'localhost',
  port: parseInt(process.env["MINIO_PORT"] || '9000'),
  useSSL: process.env["MINIO_USE_SSL"] === 'true',
  accessKey: process.env["MINIO_ACCESS_KEY"] || 'admin',
  secretKey: process.env["MINIO_SECRET_KEY"] || 'password123',
});

// Bucket name for blog images
export const MINIO_BUCKET = process.env["MINIO_BUCKET"] || 'blogging';

// Ensure bucket exists
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1');
      console.log(`Bucket ${MINIO_BUCKET} created successfully`);

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
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
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
    const url = `${process.env["MINIO_PUBLIC_URL"] || 'http://localhost:9000'}/${MINIO_BUCKET}/${uniqueFileName}`;
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
