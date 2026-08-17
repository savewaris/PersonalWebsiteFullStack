import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    degree?: string;
    institution?: string;
    fieldOfStudy?: string;
    faculty?: string;
    score?: string;
    startDate?: string;
    endDate?: string;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const edu = await prisma.education.update({
      where: { id },
      data: {
        ...(data.degree ? { degree: data.degree.trim() } : {}),
        ...(data.institution ? { institution: data.institution.trim() } : {}),
        ...(data.fieldOfStudy !== undefined ? { fieldOfStudy: data.fieldOfStudy.trim() } : {}),
        ...(data.faculty !== undefined ? { faculty: data.faculty ? data.faculty.trim() : null } : {}),
        ...(data.score !== undefined ? { score: data.score ? data.score.trim() : null } : {}),
        ...(data.startDate ? { startDate: new Date(data.startDate) } : {}),
        ...(data.endDate !== undefined ? { endDate: data.endDate ? new Date(data.endDate) : null } : {}),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(edu);
  } catch (err: any) {
    return apiError('Failed to update education record', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.education.delete({ where: { id } });
    revalidatePortfolioData();
    return apiSuccess({ message: 'Education record deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete education record', 500, err?.message);
  }
}
