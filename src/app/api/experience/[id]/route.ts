import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    role?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(data.role ? { role: data.role.trim() } : {}),
        ...(data.company ? { company: data.company.trim() } : {}),
        ...(data.location !== undefined ? { location: data.location ? data.location.trim() : null } : {}),
        ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
        ...(data.endDate !== undefined ? { endDate: data.endDate ? new Date(data.endDate) : null } : {}),
        ...(data.description ? { description: data.description.trim() } : {}),
      },
    });
    return apiSuccess(experience);
  } catch (err: any) {
    return apiError('Failed to update experience', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.experience.delete({ where: { id } });
    return apiSuccess({ message: 'Experience deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete experience', 500, err?.message);
  }
}
