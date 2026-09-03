"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { destinationInputSchema, slugify, type DestinationInput } from "@/lib/validations/destination";
import type { ActionResult } from "@/lib/actions/trips";

function toJson(arr: string[]) {
  return JSON.stringify(arr);
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.destination.findFirst({
      where: { slug, NOT: excludeId ? { id: excludeId } : undefined },
    });
    if (!existing) return slug;
    i++;
    slug = `${base}-${i}`;
  }
}

function revalidateDestinationPaths(slug?: string) {
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  revalidatePath("/");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

async function replaceFaqs(ownerId: string, faqs: { question: string; answer: string }[]) {
  await prisma.faq.deleteMany({ where: { ownerType: "DESTINATION", ownerId } });
  if (faqs.length === 0) return;
  await prisma.faq.createMany({
    data: faqs.map((f, i) => ({ ownerType: "DESTINATION", ownerId, question: f.question, answer: f.answer, order: i })),
  });
}

export async function createDestination(input: DestinationInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await requireAdminSession();
  const parsed = destinationInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const slug = await ensureUniqueSlug(slugify(data.slug || data.name));

  const destination = await prisma.destination.create({
    data: {
      name: data.name,
      slug,
      state: data.state,
      region: data.region,
      summary: data.summary,
      description: data.description,
      bestSeason: data.bestSeason,
      thingsToDo: toJson(data.thingsToDo),
      experiences: toJson(data.experiences),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      published: false,
    },
  });

  await replaceFaqs(destination.id, data.faqs);
  await logAdminActivity({
    adminId: session.user.id,
    action: "destination.created",
    entityType: "Destination",
    entityId: destination.id,
    description: `Created destination "${destination.name}"`,
  });

  revalidateDestinationPaths();
  return { success: true, data: { id: destination.id, slug: destination.slug } };
}

export async function updateDestination(id: string, input: DestinationInput): Promise<ActionResult<{ slug: string }>> {
  const session = await requireAdminSession();
  const parsed = destinationInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Destination not found." };

  const slug =
    slugify(data.slug) === existing.slug ? existing.slug : await ensureUniqueSlug(slugify(data.slug), id);

  const destination = await prisma.destination.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      state: data.state,
      region: data.region,
      summary: data.summary,
      description: data.description,
      bestSeason: data.bestSeason,
      thingsToDo: toJson(data.thingsToDo),
      experiences: toJson(data.experiences),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  await replaceFaqs(destination.id, data.faqs);
  await logAdminActivity({
    adminId: session.user.id,
    action: "destination.updated",
    entityType: "Destination",
    entityId: destination.id,
    description: `Updated destination "${destination.name}"`,
  });

  revalidateDestinationPaths(existing.slug);
  revalidateDestinationPaths(slug);
  return { success: true, data: { slug: destination.slug } };
}

export async function setDestinationPublished(id: string, published: boolean): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const destination = await prisma.destination.update({ where: { id }, data: { published } });

  await logAdminActivity({
    adminId: session.user.id,
    action: published ? "destination.published" : "destination.unpublished",
    entityType: "Destination",
    entityId: destination.id,
    description: `${published ? "Published" : "Unpublished"} destination "${destination.name}"`,
  });

  revalidateDestinationPaths(destination.slug);
  return { success: true, data: undefined };
}

export async function deleteDestination(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) return { success: false, message: "Destination not found." };

  const [tripCount, articleCount] = await Promise.all([
    prisma.trip.count({ where: { destinationId: id } }),
    prisma.travelGuideArticle.count({ where: { destinationId: id } }),
  ]);
  if (tripCount > 0) {
    return { success: false, message: `Cannot delete — ${tripCount} trip(s) still reference this destination. Reassign or delete them first.` };
  }
  if (articleCount > 0) {
    return { success: false, message: `Cannot delete — ${articleCount} article(s) still reference this destination. Unlink them first.` };
  }

  await prisma.faq.deleteMany({ where: { ownerType: "DESTINATION", ownerId: id } });
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "DESTINATION", ownerId: id } });
  await prisma.destination.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "destination.deleted",
    entityType: "Destination",
    entityId: id,
    description: `Deleted destination "${destination.name}"`,
  });

  revalidateDestinationPaths(destination.slug);
  return { success: true, data: undefined };
}

export async function setDestinationHeroImage(destinationId: string, mediaId: string | null): Promise<ActionResult<undefined>> {
  await requireAdminSession();
  await prisma.mediaUsage.deleteMany({ where: { ownerType: "DESTINATION", ownerId: destinationId, role: "HERO" } });
  if (mediaId) {
    await prisma.mediaUsage.create({ data: { mediaId, ownerType: "DESTINATION", ownerId: destinationId, role: "HERO", order: 0 } });
  }
  revalidateDestinationPaths();
  return { success: true, data: undefined };
}
