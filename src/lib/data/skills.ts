import { prisma } from '@/lib/prisma';
import type { Skill } from '@prisma/client';

export async function getSkills(): Promise<Skill[]> {
  try {
    return await prisma.skill.findMany({ orderBy: { proficiency: 'desc' } });
  } catch (error) {
    console.error('[DATA_ERROR:skills]:', error);
    return [];
  }
}
