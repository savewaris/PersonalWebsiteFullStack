import { prisma } from '@/lib/prisma';
import type { Resume } from '@prisma/client';

export async function getActiveResumes(): Promise<Resume[]> {
  try {
    return await prisma.resume.findMany({
      where: { isActive: true },
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('[DATA_ERROR] getActiveResumes:', error);
    return [];
  }
}

export async function getAllResumes(): Promise<Resume[]> {
  try {
    return await prisma.resume.findMany({
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('[DATA_ERROR] getAllResumes:', error);
    return [];
  }
}
