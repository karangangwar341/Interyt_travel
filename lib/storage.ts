import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import imageSize from "image-size";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Media storage service supporting both Neon Object Storage (S3-compatible)
// and local-filesystem fallback for development.
//
// When AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are
// configured, files are stored in the Neon Object Storage bucket and served
// directly from the bucket's public endpoint.
//
// Otherwise, files fall back to public/uploads served by Next.js static handling.

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export interface SavedFile {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export class UploadValidationError extends Error {}

function sanitizeFileName(name: string) {
  const base = name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-80);
  return base || "file";
}

const s3Endpoint = process.env.AWS_ENDPOINT_URL_S3;
const s3Region = process.env.AWS_REGION || "us-east-2";
const s3AccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Bucket = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME || "interyttravel";

const isS3Configured = Boolean(s3Endpoint && s3AccessKeyId && s3SecretAccessKey);

const s3Client = isS3Configured
  ? new S3Client({
      endpoint: s3Endpoint,
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId!,
        secretAccessKey: s3SecretAccessKey!,
      },
      forcePathStyle: true,
    })
  : null;

export async function saveUploadedFile(file: File): Promise<SavedFile> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new UploadValidationError(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new UploadValidationError(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — max ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let width: number | undefined;
  let height: number | undefined;
  try {
    const dimensions = imageSize(buffer);
    width = dimensions.width;
    height = dimensions.height;
  } catch {
    // Non-fatal — some valid images (or formats image-size can't parse)
    // just won't have dimensions recorded.
  }

  // Upload to Neon Object Storage if configured
  if (isS3Configured && s3Client) {
    const uniqueKey = `uploads/${randomUUID()}-${sanitizeFileName(file.name)}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: uniqueKey,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const cleanEndpoint = s3Endpoint!.replace(/\/$/, "");
    const publicUrl = `${cleanEndpoint}/${s3Bucket}/${uniqueKey}`;

    return {
      url: publicUrl,
      fileName: file.name || uniqueKey,
      mimeType: file.type,
      fileSize: file.size,
      width,
      height,
    };
  }

  // Fallback to local filesystem storage
  await mkdir(UPLOAD_DIR, { recursive: true });
  const uniqueName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const fullPath = path.join(UPLOAD_DIR, uniqueName);
  await writeFile(fullPath, buffer);

  return {
    url: `${PUBLIC_PREFIX}/${uniqueName}`,
    fileName: file.name || uniqueName,
    mimeType: file.type,
    fileSize: file.size,
    width,
    height,
  };
}

export async function deleteUploadedFile(url: string): Promise<void> {
  // S3 deletion
  if (isS3Configured && s3Client) {
    const cleanEndpoint = s3Endpoint!.replace(/\/$/, "");
    const s3Prefix = `${cleanEndpoint}/${s3Bucket}/`;
    if (url.startsWith(s3Prefix)) {
      const key = url.slice(s3Prefix.length);
      if (!key) return;
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: s3Bucket,
            Key: key,
          }),
        );
      } catch {
        // Ignored if already deleted
      }
      return;
    }
  }

  // Local filesystem deletion
  if (!url.startsWith(PUBLIC_PREFIX)) return;
  const fileName = url.slice(PUBLIC_PREFIX.length + 1);
  if (!fileName || fileName.includes("..")) return;

  try {
    await unlink(path.join(UPLOAD_DIR, fileName));
  } catch {
    // Already gone — fine.
  }
}
