import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: 'desc' },
    });
    return apiSuccess(education);
  } catch (error: any) {
    return apiError('Failed to fetch education records', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{
    degree?: string;
    institution?: string;
    fieldOfStudy?: string;
    faculty?: string;
    score?: string;
    startDate?: string;
    endDate?: string;
  }>(request);

  if (error || !data?.degree || !data?.institution || !data?.startDate) {
    return apiError('Degree, institution, and startDate are required', 400);
  }

  try {
    const edu = await prisma.education.create({
      data: {
        degree: data.degree.trim(),
        institution: data.institution.trim(),
        fieldOfStudy: data.fieldOfStudy?.trim() || 'General',
        faculty: data.faculty?.trim() || null,
        score: data.score?.trim() || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(edu, 201);
  } catch (err: any) {
    return apiError('Failed to create education record', 500, err?.message);
  }
}
