import { prisma } from '@/lib/prisma';
import CertificationsClient from './CertificationsClient';

export default async function CertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: [
      { order: 'asc' },
      { issueDate: 'desc' },
    ],
  });

  const serializedCertifications = certifications.map((c) => ({
    ...c,
    issueDate: c.issueDate.toISOString(),
    expiryDate: c.expiryDate ? c.expiryDate.toISOString() : null,
  }));

  return <CertificationsClient initialCertifications={serializedCertifications} />;
}
