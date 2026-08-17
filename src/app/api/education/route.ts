import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

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
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    faculty?: string | null;
    startDate?: string;
    endDate?: string | null;
    score?: string | null;
  }>(request);

  if (error || !data?.institution || !data?.degree || !data?.fieldOfStudy || !data?.startDate) {
    return apiError('Institution, degree, fieldOfStudy, and startDate are required', 400);
  }

  try {
    const education = await prisma.education.create({
      data: {
        institution: data.institution.trim(),
        degree: data.degree.trim(),
        fieldOfStudy: data.fieldOfStudy.trim(),
        faculty: data.faculty?.trim() || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        score: data.score?.trim() || null,
      },
    });
    return apiSuccess(education, 201);
  } catch (err: any) {
    return apiError('Failed to create education record', 500, err?.message);
  }
}
