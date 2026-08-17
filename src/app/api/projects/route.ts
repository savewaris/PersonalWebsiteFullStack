import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(projects);
  } catch (error: any) {
    return apiError('Failed to fetch projects', 500, error?.message);
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

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        tags: tagsString,
        demoUrl: data.demoUrl?.trim() || data.link?.trim() || null,
        repoUrl: data.repoUrl?.trim() || data.github?.trim() || null,
        imageUrl: data.imageUrl?.trim() || data.image?.trim() || null,
      },
    });
    revalidatePortfolioData();
    return apiSuccess(project, 201);
  } catch (err: any) {
    return apiError('Failed to create project', 500, err?.message);
  }
}
