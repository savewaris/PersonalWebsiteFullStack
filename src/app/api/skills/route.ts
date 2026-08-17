import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { proficiency: 'desc' },
    });
    return apiSuccess(skills);
  } catch (error: any) {
    return apiError('Failed to fetch skills', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{
    name?: string;
    proficiency?: number | string;
    category?: string;
    icon?: string;
  }>(request);

  if (error || !data?.name || data.proficiency === undefined || !data.category) {
    return apiError('Name, proficiency, and category are required', 400);
  }

  try {
    const skill = await prisma.skill.create({
      data: {
        name: data.name.trim(),
        proficiency: Math.min(100, Math.max(0, Number(data.proficiency))),
        category: data.category.trim(),
        icon: data.icon?.trim() || null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(skill, 201);
  } catch (err: any) {
    return apiError('Failed to create skill', 500, err?.message);
  }
}
