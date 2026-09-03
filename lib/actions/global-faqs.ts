"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import type { ActionResult } from "@/lib/actions/trips";

export async function replaceGlobalFaqs(faqs: { question: string; answer: string }[]): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();

  const cleaned = faqs
    .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    .filter((f) => f.question && f.answer);

  await prisma.faq.deleteMany({ where: { ownerType: "GLOBAL", ownerId: null } });
  if (cleaned.length > 0) {
    await prisma.faq.createMany({
      data: cleaned.map((f, i) => ({ ownerType: "GLOBAL", ownerId: null, question: f.question, answer: f.answer, order: i })),
    });
  }

  await logAdminActivity({
    adminId: session.user.id,
    action: "faqs.global_updated",
    entityType: "Faq",
    description: `Updated site-wide FAQs (${cleaned.length} question${cleaned.length === 1 ? "" : "s"})`,
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  return { success: true, data: undefined };
}
