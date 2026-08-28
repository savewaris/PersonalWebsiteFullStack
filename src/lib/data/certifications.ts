import { prisma } from '@/lib/prisma';
import type { Certification } from '@prisma/client';

export async function getCertifications(): Promise<Certification[]> {
  return await prisma.certification.findMany({
    orderBy: [
      { order: 'asc' },
      { issueDate: 'desc' },
    ],
  });
}
