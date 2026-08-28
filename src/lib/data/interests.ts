import { prisma } from '@/lib/prisma';
import type { Interest } from '@prisma/client';

export async function getInterests(): Promise<Interest[]> {
  try {
    return await prisma.interest.findMany({
      orderBy: [
        { category: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  } catch (error) {
    console.error('[DATA_ERROR:interests]:', error);
    return [];
  }
}
