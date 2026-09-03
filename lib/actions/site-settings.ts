"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { siteSettingsInputSchema, type SiteSettingsInput } from "@/lib/validations/site-settings";
import type { ActionResult } from "@/lib/actions/trips";

export async function updateSiteSettings(input: SiteSettingsInput): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const parsed = siteSettingsInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      businessName: data.businessName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address || null,
      instagramUrl: data.instagramUrl || null,
      facebookUrl: data.facebookUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      defaultSeoTitle: data.defaultSeoTitle,
      defaultSeoDescription: data.defaultSeoDescription,
      businessHours: data.businessHours || null,
      supportMessage: data.supportMessage || null,
    },
    create: {
      id: "singleton",
      businessName: data.businessName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address || null,
      instagramUrl: data.instagramUrl || null,
      facebookUrl: data.facebookUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      defaultSeoTitle: data.defaultSeoTitle,
      defaultSeoDescription: data.defaultSeoDescription,
      businessHours: data.businessHours || null,
      supportMessage: data.supportMessage || null,
    },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: "settings.updated",
    entityType: "SiteSettings",
    description: "Updated site-wide settings",
  });

  // Settings affect the header, footer, WhatsApp/call links, and default SEO
  // metadata across every page — invalidate the entire site, not one route.
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}
