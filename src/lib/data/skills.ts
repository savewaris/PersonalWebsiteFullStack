import { prisma } from '@/lib/prisma';
import type { Skill } from '@prisma/client';

export async function getSkills(): Promise<Skill[]> {
  return await prisma.skill.findMany({ orderBy: { proficiency: 'desc' } });
}
