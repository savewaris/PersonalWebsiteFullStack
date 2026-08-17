import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function GET() {
  try {
    const socials = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });
    return apiSuccess(socials);
  } catch (error: any) {
    return apiError('Failed to fetch social links', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{
    platform?: string;
    url?: string;
    icon?: string;
    order?: number;
  }>(request);

  if (error || !data?.platform || !data.url) {
    return apiError('Platform name and URL are required', 400);
  }

  try {
    const social = await prisma.socialLink.create({
      data: {
        platform: data.platform.trim(),
        url: ensureHttps(data.url) || data.url.trim(),
        icon: data.icon?.trim() || null,
        order: Number(data.order) || 0,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(social, 201);
  } catch (err: any) {
    return apiError('Failed to create social link', 500, err?.message);
  }
}
