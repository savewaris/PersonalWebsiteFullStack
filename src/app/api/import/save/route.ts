import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { experiences, education, skills, projects, languages, hobbies, interests, overwrite } = body;

    // Run within a transaction for safety
    await prisma.$transaction(async (tx) => {
      // If overwrite is requested, clear the old data
      if (overwrite) {
        await tx.experience.deleteMany();
        await tx.education.deleteMany();
        await tx.skill.deleteMany();
        await tx.project.deleteMany();
        await tx.language.deleteMany();
        await tx.hobby.deleteMany();
        await tx.interest.deleteMany();
      }

      // Bulk create Experiences
      if (experiences && experiences.length > 0) {
        await tx.experience.createMany({
          data: experiences.map((exp: any) => ({
            role: exp.role,
            company: exp.company,
            location: exp.location,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          }))
        });
      }

      // Bulk create Education
      if (education && education.length > 0) {
        await tx.education.createMany({
          data: education.map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            score: edu.score,
          }))
        });
      }

      // Bulk create Skills
      if (skills && skills.length > 0) {
        await tx.skill.createMany({
          data: skills.map((skill: any) => ({
            name: skill.name,
            proficiency: skill.proficiency || 50,
            category: skill.category || 'General',
          }))
        });
      }

      // Bulk create Projects
      if (projects && projects.length > 0) {
        await tx.project.createMany({
          data: projects.map((proj: any) => ({
            title: proj.title,
            description: proj.description,
            tags: proj.tags || '',
          }))
        });
      }

      // Bulk create Languages
      if (languages && languages.length > 0) {
        await tx.language.createMany({
          data: languages.map((lang: any) => ({
            name: lang.name,
            proficiency: lang.proficiency || 'Intermediate',
          }))
        });
      }

      // Bulk create Hobbies
      if (hobbies && hobbies.length > 0) {
        await tx.hobby.createMany({
          data: hobbies.map((hobby: any) => ({
            name: hobby.name,
            emoji: hobby.emoji || '✨',
          }))
        });
      }

      // Bulk create Interests
      if (interests && interests.length > 0) {
        await tx.interest.createMany({
          data: interests.map((interest: any) => ({
            name: interest.name,
            emoji: interest.emoji || '💡',
          }))
        });
      }
    });

    return NextResponse.json({ success: true, message: 'Data imported successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Import save error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save imported data' }, { status: 500 });
  }
}
