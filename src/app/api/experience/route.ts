import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
    return apiSuccess(experiences);
  } catch (error: any) {
    return apiError('Failed to fetch experiences', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{
    role?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
  }>(request);

  if (error || !data?.role || !data?.company || !data?.startDate || !data?.description) {
    return apiError('Role, company, startDate, and description are required', 400);
  }

  try {
    const experience = await prisma.experience.create({
      data: {
        role: data.role.trim(),
        company: data.company.trim(),
        location: data.location?.trim() || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description.trim(),
      },
    });
    return apiSuccess(experience, 201);
  } catch (err: any) {
    return apiError('Failed to create experience', 500, err?.message);
  }
}
