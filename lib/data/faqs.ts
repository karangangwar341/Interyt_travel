import { prisma } from "@/lib/db";

export interface SimpleFaq {
  question: string;
  answer: string;
}

export async function getGlobalFaqs(): Promise<SimpleFaq[]> {
  const rows = await prisma.faq.findMany({
    where: { ownerType: "GLOBAL", ownerId: null },
    orderBy: { order: "asc" },
  });
  return rows.map((f) => ({ question: f.question, answer: f.answer }));
}
