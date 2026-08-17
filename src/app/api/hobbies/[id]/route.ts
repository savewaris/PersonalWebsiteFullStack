import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{ name?: string; emoji?: string }>(request);
  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const hobby = await prisma.hobby.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.emoji !== undefined ? { emoji: data.emoji ? data.emoji.trim() : null } : {}),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(hobby);
  } catch (err: any) {
    return apiError('Failed to update hobby', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.hobby.delete({ where: { id } });
    revalidatePortfolioData();
    return apiSuccess({ message: 'Hobby deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete hobby', 500, err?.message);
  }
}
