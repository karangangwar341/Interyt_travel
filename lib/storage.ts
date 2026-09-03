import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import imageSize from "image-size";

// Local-filesystem media storage for development. Every uploaded file lands
// in public/uploads and is served directly by Next.js's static file
// handling — Media.url stores the resulting "/uploads/..." path.
//
// This is intentionally the ONE module that knows where files physically
// live. Swapping to a real object store (S3/R2/Vercel Blob) for production
// means rewriting saveUploadedFile/deleteUploadedFile here only — nothing
// else in the app touches the filesystem directly.

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

export async function saveUploadedFile(file: File): Promise<SavedFile> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new UploadValidationError(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new UploadValidationError(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — max ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const fullPath = path.join(UPLOAD_DIR, uniqueName);
  await writeFile(fullPath, buffer);

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
  if (!url.startsWith(PUBLIC_PREFIX)) return;
  const fileName = url.slice(PUBLIC_PREFIX.length + 1);
  if (!fileName || fileName.includes("..")) return;

  try {
    await unlink(path.join(UPLOAD_DIR, fileName));
  } catch {
    // Already gone — fine.
  }
}
