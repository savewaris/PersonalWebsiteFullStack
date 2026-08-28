import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' },
      ],
    });
    return apiSuccess(certs);
  } catch (error: any) {
    return apiError('Failed to fetch certifications', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

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

  if (error || !data?.title || !data?.issuer || !data?.issueDate || !data?.credentialUrl) {
    return apiError('Title, issuer, issueDate, and credentialUrl are required', 400);
  }

  try {
    const cert = await prisma.certification.create({
      data: {
        title: data.title.trim(),
        issuer: data.issuer.trim(),
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        credentialId: data.credentialId?.trim() || null,
        credentialUrl: ensureHttps(data.credentialUrl) || data.credentialUrl.trim(),
        badgeImageUrl: data.badgeImageUrl?.trim() || null,
        order: typeof data.order === 'number' ? data.order : 0,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(cert, 201);
  } catch (err: any) {
    return apiError('Failed to create certification', 500, err?.message);
  }
}
