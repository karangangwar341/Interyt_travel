import { prisma } from "@/lib/db";

export async function logAdminActivity(params: {
  adminId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
}) {
  await prisma.adminActivity.create({
    data: {
      adminId: params.adminId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
    },
  });
}
