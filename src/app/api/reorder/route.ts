import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

// Whitelist: resource name (admin route segment) -> Prisma delegate with an `order` column.
const DELEGATES = {
  skills: prisma.skill,
  projects: prisma.project,
  experience: prisma.experience,
  education: prisma.education,
  hobbies: prisma.hobby,
  interests: prisma.interest,
  languages: prisma.language,
  certifications: prisma.certification,
  socials: prisma.socialLink,
  resumes: prisma.resume,
} as const;

type Resource = keyof typeof DELEGATES;

/**
 * POST /api/reorder  { resource, ids }
 * Persists a manual order: ids[0] -> order 1, ids[1] -> order 2, ...
 * (new items keep the default 0, so they sort to the top until placed).
 */
export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data, error } = await parseJsonBody<{ resource?: string; ids?: unknown }>(request);
  if (error || !data) return apiError('Invalid request body', 400);

  const { resource, ids } = data;
  if (!resource || !(resource in DELEGATES)) return apiError('Unknown resource', 400);
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === 'string')) {
    return apiError('ids must be a non-empty array of strings', 400);
  }
  if (new Set(ids).size !== ids.length) return apiError('ids must be unique', 400);

  try {
    const delegate = DELEGATES[resource as Resource] as unknown as {
      update: (args: { where: { id: string }; data: { order: number } }) => ReturnType<typeof prisma.skill.update>;
    };
    await prisma.$transaction(
      (ids as string[]).map((id, index) => delegate.update({ where: { id }, data: { order: index + 1 } })),
    );
    revalidatePortfolioData();
    return apiSuccess({ resource, count: ids.length });
  } catch (err) {
    return apiError('Failed to save order', 500, err instanceof Error ? err.message : undefined);
  }
}
