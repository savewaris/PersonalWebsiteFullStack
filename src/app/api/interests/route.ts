import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({ orderBy: { createdAt: 'asc' } });
    return apiSuccess(interests);
  } catch (error: any) {
    return apiError('Failed to fetch interests', 500, error?.message);
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
    const interest = await prisma.interest.create({
      data: {
        name: data.name.trim(),
        emoji: data.emoji?.trim() || null,
      },
    });
    return apiSuccess(interest, 201);
  } catch (err: any) {
    return apiError('Failed to create interest', 500, err?.message);
  }
}
