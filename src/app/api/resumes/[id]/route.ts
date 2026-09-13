import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    title?: string;
    roleCategory?: string;
    isPrimary?: boolean;
    isActive?: boolean;
    order?: number;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request body', 400);
  }

  try {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Resume not found', 404);
    }

    if (data.isPrimary) {
      // Unset existing primary resumes
      await prisma.resume.updateMany({
        where: { id: { not: id }, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : existing.title,
        roleCategory: data.roleCategory !== undefined ? data.roleCategory : existing.roleCategory,
        isPrimary: data.isPrimary !== undefined ? data.isPrimary : existing.isPrimary,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
        order: data.order !== undefined ? data.order : existing.order,
      },
    });

    revalidatePortfolioData();
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError('Failed to update resume', 500, err?.message);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;

  try {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Resume not found', 404);
    }

    // Delete record from DB
    await prisma.resume.delete({ where: { id } });

    // Clean up local file from disk if it lives in /uploads/resumes/
    if (existing.fileUrl.startsWith('/uploads/resumes/')) {
      const filePath = path.join(process.cwd(), 'public', existing.fileUrl);
      unlink(filePath).catch(() => {});
    }

    revalidatePortfolioData();
    return apiSuccess({ deleted: true, id });
  } catch (err: any) {
    return apiError('Failed to delete resume', 500, err?.message);
  }
}
