import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    name?: string;
    proficiency?: number | string;
    category?: string;
    icon?: string;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.proficiency !== undefined
          ? { proficiency: Math.min(100, Math.max(0, Number(data.proficiency))) }
          : {}),
        ...(data.category ? { category: data.category.trim() } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ? data.icon.trim() : null } : {}),
      },
    });
    return apiSuccess(skill);
  } catch (err: any) {
    return apiError('Failed to update skill', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.skill.delete({ where: { id } });
    return apiSuccess({ message: 'Skill deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete skill', 500, err?.message);
  }
}
