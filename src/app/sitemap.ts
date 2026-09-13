import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waris.dev';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resume.pdf`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  try {
    // Dynamic Active Resumes
    const resumes = await prisma.resume.findMany({
      where: { isActive: true },
      select: { fileUrl: true, updatedAt: true },
    });

    for (const r of resumes) {
      const fullUrl = r.fileUrl.startsWith('http') ? r.fileUrl : `${baseUrl}${r.fileUrl}`;
      routes.push({
        url: fullUrl,
        lastModified: r.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    // Dynamic Projects
    const projects = await prisma.project.findMany({
      select: { id: true, updatedAt: true },
    });

    for (const p of projects) {
      routes.push({
        url: `${baseUrl}/#project-${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (err) {
    // Graceful fallback if database is not reachable during build
  }

  return routes;
}
