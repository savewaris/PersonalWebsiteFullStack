import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    title?: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string | null;
    credentialId?: string | null;
    credentialUrl?: string;
    badgeImageUrl?: string | null;
    order?: number;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const cert = await prisma.certification.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.issuer ? { issuer: data.issuer.trim() } : {}),
        ...(data.issueDate ? { issueDate: new Date(data.issueDate) } : {}),
        ...(data.expiryDate !== undefined ? { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null } : {}),
        ...(data.credentialId !== undefined ? { credentialId: data.credentialId?.trim() || null } : {}),
        ...(data.credentialUrl ? { credentialUrl: ensureHttps(data.credentialUrl) || data.credentialUrl.trim() } : {}),
        ...(data.badgeImageUrl !== undefined ? { badgeImageUrl: data.badgeImageUrl?.trim() || null } : {}),
        ...(typeof data.order === 'number' ? { order: data.order } : {}),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(cert);
  } catch (err: any) {
    return apiError('Failed to update certification', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.certification.delete({ where: { id } });
    revalidatePortfolioData();
    return apiSuccess({ message: 'Certification deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete certification', 500, err?.message);
  }
}
