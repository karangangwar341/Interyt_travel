"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { blogInputSchema, slugify, type BlogInput } from "@/lib/validations/blog";
import type { ActionResult } from "@/lib/actions/trips";

async function ensureUniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.travelGuideArticle.findFirst({
      where: { slug, NOT: excludeId ? { id: excludeId } : undefined },
    });
    if (!existing) return slug;
    i++;
    slug = `${base}-${i}`;
  }
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/travel-guide");
  revalidatePath("/");
  if (slug) revalidatePath(`/travel-guide/${slug}`);
}

async function replaceRelatedTrips(blogId: string, tripIds: string[]) {
  await prisma.blogRelatedTrip.deleteMany({ where: { blogId } });
  if (tripIds.length === 0) return;
  await prisma.blogRelatedTrip.createMany({
    data: [...new Set(tripIds)].map((tripId) => ({ blogId, tripId })),
  });
}

export async function createArticle(input: BlogInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await requireAdminSession();
  const parsed = blogInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const slug = await ensureUniqueSlug(slugify(data.slug || data.title));

  const article = await prisma.travelGuideArticle.create({
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId,
      destinationId: data.destinationId || null,
      excerpt: data.excerpt,
      content: JSON.stringify(data.sections),
      readTimeMinutes: data.readTimeMinutes,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      published: false,
    },
  });

  await replaceRelatedTrips(article.id, data.relatedTripIds);
  await logAdminActivity({
    adminId: session.user.id,
    action: "blog.created",
    entityType: "TravelGuideArticle",
    entityId: article.id,
    description: `Created article "${article.title}"`,
  });

  revalidateBlogPaths();
  return { success: true, data: { id: article.id, slug: article.slug } };
}

export async function updateArticle(id: string, input: BlogInput): Promise<ActionResult<{ slug: string }>> {
  const session = await requireAdminSession();
  const parsed = blogInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const existing = await prisma.travelGuideArticle.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Article not found." };

  const slug =
    slugify(data.slug) === existing.slug ? existing.slug : await ensureUniqueSlug(slugify(data.slug), id);

  const article = await prisma.travelGuideArticle.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId,
      destinationId: data.destinationId || null,
      excerpt: data.excerpt,
      content: JSON.stringify(data.sections),
      readTimeMinutes: data.readTimeMinutes,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  await replaceRelatedTrips(article.id, data.relatedTripIds);
  await logAdminActivity({
    adminId: session.user.id,
    action: "blog.updated",
    entityType: "TravelGuideArticle",
    entityId: article.id,
    description: `Updated article "${article.title}"`,
  });

  revalidateBlogPaths(existing.slug);
  revalidateBlogPaths(slug);
  return { success: true, data: { slug: article.slug } };
}

export async function setArticlePublished(id: string, published: boolean): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const article = await prisma.travelGuideArticle.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: published ? "blog.published" : "blog.unpublished",
    entityType: "TravelGuideArticle",
    entityId: article.id,
    description: `${published ? "Published" : "Unpublished"} article "${article.title}"`,
  });

  revalidateBlogPaths(article.slug);
  return { success: true, data: undefined };
}

export async function duplicateArticle(id: string): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdminSession();
  const original = await prisma.travelGuideArticle.findUnique({
    where: { id },
    include: { relatedTrips: { select: { tripId: true } } },
  });
  if (!original) return { success: false, message: "Article not found." };

  const newSlug = await ensureUniqueSlug(`${original.slug}-copy`);
  const copy = await prisma.travelGuideArticle.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: newSlug,
      categoryId: original.categoryId,
      destinationId: original.destinationId,
      excerpt: original.excerpt,
      content: original.content,
      readTimeMinutes: original.readTimeMinutes,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      published: false,
    },
  });

  if (original.relatedTrips.length > 0) {
    await prisma.blogRelatedTrip.createMany({
      data: original.relatedTrips.map((r) => ({ blogId: copy.id, tripId: r.tripId })),
    });
  }

  await logAdminActivity({
    adminId: session.user.id,
    action: "blog.duplicated",
    entityType: "TravelGuideArticle",
    entityId: copy.id,
    description: `Duplicated article "${original.title}" as "${copy.title}"`,
  });

  revalidateBlogPaths();
  return { success: true, data: { id: copy.id } };
}

export async function deleteArticle(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const article = await prisma.travelGuideArticle.findUnique({ where: { id } });
  if (!article) return { success: false, message: "Article not found." };

  await prisma.blogRelatedTrip.deleteMany({ where: { blogId: id } });
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "BLOG", ownerId: id } });
  await prisma.travelGuideArticle.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "blog.deleted",
    entityType: "TravelGuideArticle",
    entityId: id,
    description: `Deleted article "${article.title}"`,
  });

  revalidateBlogPaths(article.slug);
  return { success: true, data: undefined };
}

export async function setArticleHeroImage(articleId: string, mediaId: string | null): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "BLOG", ownerId: articleId, role: "HERO" } });
  if (mediaId) {
    await prisma.mediaUsage.create({ data: { mediaId, ownerType: "BLOG", ownerId: articleId, role: "HERO", order: 0 } });
  }
  revalidateBlogPaths();
  return { success: true, data: undefined };
}
