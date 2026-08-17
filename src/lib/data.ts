import { prisma } from '@/lib/prisma';
import { Skill, Project, Experience, Education, Hobby, Interest, Language } from '@prisma/client';

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

export async function getStats(): Promise<PortfolioStats> {
  const [projects, skills, experience] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
  ]);

  return { projects, skills, experience };
}
