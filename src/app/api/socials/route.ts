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
    actionType?: string;
    order?: number;
  }>(request);

  if (error || !data?.platform || !data.url) {
    return apiError('Platform name and URL/handle are required', 400);
  }

  const isCopy = data.actionType === 'copy';
  const formattedUrl = isCopy
    ? data.url.trim()
    : (data.url.includes('@') && !data.url.startsWith('mailto:') && !data.url.startsWith('http'))
    ? `mailto:${data.url.trim()}`
    : ensureHttps(data.url) || data.url.trim();

  try {
    const social = await prisma.socialLink.create({
      data: {
        platform: data.platform.trim(),
        url: formattedUrl,
        icon: data.icon?.trim() || null,
        actionType: isCopy ? 'copy' : 'redirect',
        order: Number(data.order) || 0,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(social, 201);
  } catch (err: any) {
    return apiError('Failed to create social link', 500, err?.message);
  }
}
