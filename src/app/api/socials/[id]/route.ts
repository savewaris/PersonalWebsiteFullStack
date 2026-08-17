import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    platform?: string;
    url?: string;
    icon?: string;
    actionType?: string;
    order?: number;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  let formattedUrl: string | undefined = undefined;
  if (data.url !== undefined) {
    const isCopy = data.actionType === 'copy';
    formattedUrl = isCopy
      ? data.url.trim()
      : (data.url.includes('@') && !data.url.startsWith('mailto:') && !data.url.startsWith('http'))
      ? `mailto:${data.url.trim()}`
      : ensureHttps(data.url) || data.url.trim();
  }

  try {
    const social = await prisma.socialLink.update({
      where: { id },
      data: {
        ...(data.platform ? { platform: data.platform.trim() } : {}),
        ...(formattedUrl !== undefined ? { url: formattedUrl } : {}),
        ...(data.icon !== undefined ? { icon: data.icon ? data.icon.trim() : null } : {}),
        ...(data.actionType !== undefined ? { actionType: data.actionType === 'copy' ? 'copy' : 'redirect' } : {}),
        ...(data.order !== undefined ? { order: Number(data.order) } : {}),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(social);
  } catch (err: any) {
    return apiError('Failed to update social link', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.socialLink.delete({ where: { id } });
    revalidatePortfolioData();
    return apiSuccess({ message: 'Social link deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete social link', 500, err?.message);
  }
}
