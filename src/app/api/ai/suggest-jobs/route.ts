import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, requireAuthSession } from '@/lib/api-utils';
import { generateGeminiJson } from '@/lib/gemini';

export interface SuggestedJob {
  title: string;
  description: string;
  keywords: string[];
}

export async function GET() {
  const authError = await requireAuthSession();
  if (authError) return authError;

  try {
    const [skills, experience, education, projects] = await Promise.all([
      prisma.skill.findMany(),
      prisma.experience.findMany(),
      prisma.education.findMany(),
      prisma.project.findMany(),
    ]);

    const profileData = { skills, experience, education, projects };
    const prompt = `
You are an expert career counselor and recruiter. 
Analyze the following user profile (JSON containing skills, experience, education, and projects).
Suggest 3 real-world job titles that this user is highly qualified for, along with a brief description of why they fit and the key skills required.

Return ONLY valid JSON in this exact structure:
[
  {
    "title": "Job Title (e.g., Senior Full Stack Engineer)",
    "description": "A brief, 2-sentence description of the role and why the user fits perfectly based on their profile.",
    "keywords": ["React", "Node.js", "System Design"]
  }
]

User Profile:
${JSON.stringify(profileData, null, 2)}
    `;

    const suggestedJobs = await generateGeminiJson<SuggestedJob[]>(prompt);
    return apiSuccess({ data: suggestedJobs });
  } catch (error: any) {
    return apiError('Failed to suggest jobs', 500, error?.message);
  }
}
