import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    title?: string;
    description?: string;
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
    tags?: string;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.description ? { description: data.description.trim() } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl ? data.imageUrl.trim() : null } : {}),
        ...(data.demoUrl !== undefined ? { demoUrl: data.demoUrl ? data.demoUrl.trim() : null } : {}),
        ...(data.repoUrl !== undefined ? { repoUrl: data.repoUrl ? data.repoUrl.trim() : null } : {}),
        ...(data.tags !== undefined ? { tags: data.tags.trim() } : {}),
      },
    });
    return apiSuccess(project);
  } catch (err: any) {
    return apiError('Failed to update project', 500, err?.message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return apiSuccess({ message: 'Project deleted successfully' });
  } catch (err: any) {
    return apiError('Failed to delete project', 500, err?.message);
  }
}
