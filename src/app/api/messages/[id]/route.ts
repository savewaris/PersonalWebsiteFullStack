import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{ read?: boolean }>(request);

  if (error || data?.read === undefined) {
    return apiError('The read status is required', 400);
  }

  try {
    const message = await prisma.message.update({
      where: { id },
      data: { read: Boolean(data.read) },
    });
    return apiSuccess(message);
  } catch (err: any) {
    return apiError('Failed to update message status', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.message.delete({ where: { id } });
    return apiSuccess({ message: 'Message deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete message', 500, err?.message);
  }
}
