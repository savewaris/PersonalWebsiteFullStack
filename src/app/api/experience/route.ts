import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

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
    description?: string;
    startDate?: string;
    endDate?: string;
  }>(request);

  if (error || !data?.role || !data?.company || !data?.description || !data?.startDate) {
    return apiError('Role, company, description, and startDate are required', 400);
  }

  try {
    const exp = await prisma.experience.create({
      data: {
        role: data.role.trim(),
        company: data.company.trim(),
        description: data.description.trim(),
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(exp, 201);
  } catch (err: any) {
    return apiError('Failed to create experience', 500, err?.message);
  }
}
