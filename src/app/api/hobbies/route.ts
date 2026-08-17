import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const hobbies = await prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } });
    return apiSuccess(hobbies);
  } catch (error: any) {
    return apiError('Failed to fetch hobbies', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{ name?: string; emoji?: string }>(request);
  if (error || !data?.name) {
    return apiError('Name is required', 400);
  }

  try {
    const hobby = await prisma.hobby.create({
      data: {
        name: data.name.trim(),
        emoji: data.emoji?.trim() || null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(hobby, 201);
  } catch (err: any) {
    return apiError('Failed to create hobby', 500, err?.message);
  }
}
