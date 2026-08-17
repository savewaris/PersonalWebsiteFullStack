import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const languages = await prisma.language.findMany({ orderBy: { createdAt: 'asc' } });
    return apiSuccess(languages);
  } catch (error: any) {
    return apiError('Failed to fetch languages', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{ name?: string; proficiency?: string }>(request);
  if (error || !data?.name || !data?.proficiency) {
    return apiError('Name and proficiency are required', 400);
  }

  try {
    const lang = await prisma.language.create({
      data: {
        name: data.name.trim(),
        proficiency: data.proficiency.trim(),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(lang, 201);
  } catch (err: any) {
    return apiError('Failed to create language', 500, err?.message);
  }
}
