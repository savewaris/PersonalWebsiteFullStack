import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  const { data, error } = await parseJsonBody<{
    title?: string;
    description?: string;
    tags?: string[] | string;
    demoUrl?: string;
    link?: string;
    repoUrl?: string;
    github?: string;
    imageUrl?: string;
    image?: string;
    videoPreviewUrl?: string;
    galleryImages?: string[] | string;
  }>(request);

  if (error || !data) {
    return apiError('Invalid request payload', 400);
  }

  let tagsString: string | undefined = undefined;
  if (data.tags !== undefined) {
    if (Array.isArray(data.tags)) {
      tagsString = data.tags.join(', ');
    } else if (typeof data.tags === 'string') {
      tagsString = data.tags;
    }
  }

  let galleryString: string | null | undefined = undefined;
  if (data.galleryImages !== undefined) {
    if (Array.isArray(data.galleryImages)) {
      galleryString = data.galleryImages.filter(Boolean).join(', ') || null;
    } else if (typeof data.galleryImages === 'string') {
      galleryString = data.galleryImages.trim() || null;
    } else {
      galleryString = null;
    }
  }

  const demo = data.demoUrl !== undefined ? data.demoUrl : data.link;
  const repo = data.repoUrl !== undefined ? data.repoUrl : data.github;
  const image = data.imageUrl !== undefined ? data.imageUrl : data.image;

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.description ? { description: data.description.trim() } : {}),
        ...(tagsString !== undefined ? { tags: tagsString } : {}),
        ...(demo !== undefined ? { demoUrl: ensureHttps(demo) } : {}),
        ...(repo !== undefined ? { repoUrl: ensureHttps(repo) } : {}),
        ...(image !== undefined ? { imageUrl: ensureHttps(image) } : {}),
        ...(data.videoPreviewUrl !== undefined ? { videoPreviewUrl: ensureHttps(data.videoPreviewUrl) } : {}),
        ...(galleryString !== undefined ? { galleryImages: galleryString } : {}),
      },
    });
    revalidatePortfolioData();
    return apiSuccess(project);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return apiError('Failed to update project', 500, message);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePortfolioData();
    return apiSuccess({ message: 'Project deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return apiError('Failed to delete project', 500, message);
  }
}
