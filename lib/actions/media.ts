"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { saveUploadedFile, deleteUploadedFile, UploadValidationError } from "@/lib/storage";
import { getAllMedia, getMediaUsageDetails, type MediaUsageDetail, type MediaItem } from "@/lib/data/media";

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function fetchMediaUsages(id: string): Promise<MediaUsageDetail[]> {
  await requireAdminSession();
  return getMediaUsageDetails(id);
}

/** Client-callable read used by MediaPicker (a client component embedded in
 * CMS forms) to list the library without duplicating the query there. */
export async function getAllMediaAction(): Promise<MediaItem[]> {
  await requireAdminSession();
  return getAllMedia();
}

export async function uploadMedia(
  formData: FormData,
): Promise<ActionResult<{ uploaded: number; errors: string[]; created: MediaItem[] }>> {
  const session = await requireAdminSession();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { success: false, message: "No files provided." };
  }

  const created: MediaItem[] = [];
  const errors: string[] = [];

  for (const file of files) {
    try {
      const saved = await saveUploadedFile(file);
      const row = await prisma.media.create({
        data: {
          url: saved.url,
          fileName: saved.fileName,
          mimeType: saved.mimeType,
          fileSize: saved.fileSize,
          width: saved.width,
          height: saved.height,
          uploadedBy: session.user.email ?? session.user.id,
        },
      });
      created.push({
        id: row.id,
        url: row.url,
        thumbnailUrl: row.thumbnailUrl,
        fileName: row.fileName,
        mimeType: row.mimeType,
        fileSize: row.fileSize,
        width: row.width,
        height: row.height,
        altText: row.altText,
        title: row.title,
        caption: row.caption,
        description: row.description,
        createdAt: row.createdAt.toISOString(),
        usageCount: 0,
      });
    } catch (err) {
      const message = err instanceof UploadValidationError ? err.message : "Upload failed.";
      errors.push(`${file.name}: ${message}`);
    }
  }

  revalidatePath("/admin/media");
  return { success: true, data: { uploaded: created.length, errors, created } };
}

const metadataSchema = z.object({
  altText: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
  caption: z.string().max(300).optional(),
  description: z.string().max(1000).optional(),
});

export async function updateMediaMetadata(
  id: string,
  input: z.infer<typeof metadataSchema>,
): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  const parsed = metadataSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Invalid metadata." };
  }

  await prisma.media.update({
    where: { id },
    data: {
      altText: parsed.data.altText || null,
      title: parsed.data.title || null,
      caption: parsed.data.caption || null,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/admin/media");
  return { success: true, data: undefined };
}

export async function replaceMediaFile(id: string, formData: FormData): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "No file provided." };
  }

  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Media not found." };
  }

  try {
    const saved = await saveUploadedFile(file);
    await prisma.media.update({
      where: { id },
      data: {
        url: saved.url,
        fileName: saved.fileName,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        width: saved.width,
        height: saved.height,
      },
    });
    await deleteUploadedFile(existing.url);
  } catch (err) {
    const message = err instanceof UploadValidationError ? err.message : "Replace failed.";
    return { success: false, message };
  }

  revalidatePath("/admin/media");
  return { success: true, data: undefined };
}

export async function deleteMedia(id: string, force = false): Promise<ActionResult<{ usages: number }>> {
  await requireAdminSession();

  const usages = await getMediaUsageDetails(id);
  if (usages.length > 0 && !force) {
    return {
      success: false,
      message: `This image is currently used in ${usages.length} place${usages.length === 1 ? "" : "s"}.`,
    };
  }

  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Media not found." };
  }

  await prisma.mediaUsage.deleteMany({ where: { mediaId: id } });
  await prisma.media.delete({ where: { id } });
  await deleteUploadedFile(existing.url);

  revalidatePath("/admin/media");
  return { success: true, data: { usages: usages.length } };
}
