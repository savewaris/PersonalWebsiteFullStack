import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: [
        { category: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    return apiSuccess(interests);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError('Failed to fetch interests', 500, message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{ name?: string; emoji?: string; category?: string }>(request);
  if (error || !data?.name) {
    return apiError('Name is required', 400);
  }

  try {
    const interest = await prisma.interest.create({
      data: {
        name: data.name.trim(),
        category: data.category?.trim() || 'Engineering & Core Tech',
        emoji: data.emoji?.trim() || null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(interest, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return apiError('Failed to create interest', 500, message);
  }
}
