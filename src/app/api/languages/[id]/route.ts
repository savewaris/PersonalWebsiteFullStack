import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{ name?: string; proficiency?: string }>(request);
  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const language = await prisma.language.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.proficiency ? { proficiency: data.proficiency.trim() } : {}),
      },
    });
    return apiSuccess(language);
  } catch (err: any) {
    return apiError('Failed to update language', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.language.delete({ where: { id } });
    return apiSuccess({ message: 'Language deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete language', 500, err?.message);
  }
}
