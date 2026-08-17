import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

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
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
    tags?: string;
  }>(request);

  if (error || !data?.title || !data?.description) {
    return apiError('Title and description are required', 400);
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        demoUrl: data.demoUrl?.trim() || null,
        repoUrl: data.repoUrl?.trim() || null,
        tags: data.tags?.trim() || '',
      },
    });
    return apiSuccess(project, 201);
  } catch (err: any) {
    return apiError('Failed to create project', 500, err?.message);
  }
}
