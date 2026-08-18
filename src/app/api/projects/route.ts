import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(projects);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError('Failed to fetch projects', 500, message);
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

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

  if (error || !data?.title || !data.description) {
    return apiError('Title and description are required', 400);
  }

  let tagsString = '';
  if (Array.isArray(data.tags)) {
    tagsString = data.tags.join(', ');
  } else if (typeof data.tags === 'string') {
    tagsString = data.tags;
  }

  let galleryString: string | null = null;
  if (Array.isArray(data.galleryImages)) {
    galleryString = data.galleryImages.filter(Boolean).join(', ');
  } else if (typeof data.galleryImages === 'string') {
    galleryString = data.galleryImages.trim() || null;
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        tags: tagsString,
        demoUrl: ensureHttps(data.demoUrl || data.link),
        repoUrl: ensureHttps(data.repoUrl || data.github),
        imageUrl: ensureHttps(data.imageUrl || data.image),
        videoPreviewUrl: ensureHttps(data.videoPreviewUrl),
        galleryImages: galleryString,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(project, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return apiError('Failed to create project', 500, message);
  }
}
