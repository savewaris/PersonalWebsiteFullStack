import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function POST(req: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data: body, error } = await parseJsonBody<{
    experiences?: any[];
    education?: any[];
    skills?: any[];
    projects?: any[];
    languages?: any[];
    hobbies?: any[];
    interests?: any[];
    overwrite?: boolean;
  }>(req);

  if (error || !body) {
    return apiError('Invalid request payload', 400);
  }

  const { experiences, education, skills, projects, languages, hobbies, interests, overwrite } = body;

  try {
    await prisma.$transaction(async (tx) => {
      if (overwrite) {
        await tx.experience.deleteMany();
        await tx.education.deleteMany();
        await tx.skill.deleteMany();
        await tx.project.deleteMany();
        await tx.language.deleteMany();
        await tx.hobby.deleteMany();
        await tx.interest.deleteMany();
      }

      if (experiences && experiences.length > 0) {
        await tx.experience.createMany({
          data: experiences.map((exp: any) => ({
            role: exp.role,
            company: exp.company,
            location: exp.location || null,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
        });
      }

      if (education && education.length > 0) {
        await tx.education.createMany({
          data: education.map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            faculty: edu.faculty || null,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            score: edu.score || null,
          })),
        });
      }

      if (skills && skills.length > 0) {
        await tx.skill.createMany({
          data: skills.map((skill: any) => ({
            name: skill.name,
            proficiency: Number(skill.proficiency) || 50,
            category: skill.category || 'General',
          })),
        });
      }

      if (projects && projects.length > 0) {
        await tx.project.createMany({
          data: projects.map((proj: any) => ({
            title: proj.title,
            description: proj.description,
            tags: proj.tags || '',
          })),
        });
      }

      if (languages && languages.length > 0) {
        await tx.language.createMany({
          data: languages.map((lang: any) => ({
            name: lang.name,
            proficiency: lang.proficiency || 'Intermediate',
          })),
        });
      }

      if (hobbies && hobbies.length > 0) {
        await tx.hobby.createMany({
          data: hobbies.map((hobby: any) => ({
            name: hobby.name,
            emoji: hobby.emoji || '✨',
          })),
        });
      }

      if (interests && interests.length > 0) {
        await tx.interest.createMany({
          data: interests.map((interest: any) => ({
            name: interest.name,
            emoji: interest.emoji || '💡',
          })),
        });
      }
    });

    return apiSuccess({ success: true, message: 'Profile data saved successfully' });
  } catch (err: any) {
    return apiError('Failed to save imported data', 500, err?.message);
  }
}
