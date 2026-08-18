import { prisma } from '@/lib/prisma';
import type { SocialLink } from '@prisma/client';

export async function getSocialLinks(): Promise<SocialLink[]> {
  const socials = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
  if (socials.length === 0) {
    // Seed defaults automatically
    try {
      await prisma.socialLink.createMany({
        data: [
          { platform: 'GitHub', url: 'https://github.com/savewaris', actionType: 'redirect', order: 1 },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/waris-khamkaweepart/', actionType: 'redirect', order: 2 },
          { platform: 'Instagram', url: 'https://www.instagram.com/save.waris/', actionType: 'redirect', order: 3 },
        ],
      });
      return await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    } catch {
      // Fallback in-memory
      return [
        { id: '1', platform: 'GitHub', url: 'https://github.com/savewaris', icon: null, actionType: 'redirect', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/waris-khamkaweepart/', icon: null, actionType: 'redirect', order: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', platform: 'Instagram', url: 'https://www.instagram.com/save.waris/', icon: null, actionType: 'redirect', order: 3, createdAt: new Date(), updatedAt: new Date() },
      ];
    }
  }
  return socials;
}
