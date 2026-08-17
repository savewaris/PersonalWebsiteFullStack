import { prisma } from '@/lib/prisma';
import { Skill, Project, Experience, Education, Hobby, Interest, Language, SocialLink } from '@prisma/client';

export type PortfolioStats = {
  projects: number;
  skills: number;
  experience: number;
};

export async function getSkills(): Promise<Skill[]> {
  return await prisma.skill.findMany({ orderBy: { proficiency: 'desc' } });
}

export async function getProjects(): Promise<Project[]> {
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getExperiences(): Promise<Experience[]> {
  return await prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
}

export async function getEducation(): Promise<Education[]> {
  return await prisma.education.findMany({ orderBy: { startDate: 'desc' } });
}

export async function getHobbies(): Promise<Hobby[]> {
  return await prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function getInterests(): Promise<Interest[]> {
  return await prisma.interest.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function getLanguages(): Promise<Language[]> {
  return await prisma.language.findMany({ orderBy: { proficiency: 'asc' } });
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const socials = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
  if (socials.length === 0) {
    // Seed defaults automatically
    try {
      await prisma.socialLink.createMany({
        data: [
          { platform: 'GitHub', url: 'https://github.com/savewaris', order: 1 },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/waris-khamkaweepart/', order: 2 },
          { platform: 'Instagram', url: 'https://www.instagram.com/save.waris/', order: 3 },
        ],
      });
      return await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    } catch (e) {
      // Fallback in-memory
      return [
        { id: '1', platform: 'GitHub', url: 'https://github.com/savewaris', icon: null, order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/waris-khamkaweepart/', icon: null, order: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: '3', platform: 'Instagram', url: 'https://www.instagram.com/save.waris/', icon: null, order: 3, createdAt: new Date(), updatedAt: new Date() },
      ];
    }
  }
  return socials;
}

export async function getStats(): Promise<PortfolioStats> {
  const [projects, skills, experience] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
  ]);

  return { projects, skills, experience };
}
