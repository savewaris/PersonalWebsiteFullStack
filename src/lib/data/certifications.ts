import { prisma } from '@/lib/prisma';
import type { Certification } from '@prisma/client';

export async function getCertifications(): Promise<Certification[]> {
  try {
    return await prisma.certification.findMany({
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' },
      ],
    });
  } catch (error) {
    console.error('[DATA_ERROR:certifications]:', error);
    return [];
  }
}
