import { prisma } from '@/lib/prisma';
import type { Certification } from '@prisma/client';

export async function getCertifications(): Promise<Certification[]> {
  try {
    return await prisma.certification.findMany({
      where: { isVisible: true },
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' },
        { id: 'asc' }, // stable tie-break so equal rows don't shuffle between loads
      ],
    });
  } catch (error) {
    console.error('[DATA_ERROR:certifications]:', error);
    return [];
  }
}
