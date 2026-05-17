import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const keyToUse = process.env.GEMINI_API_KEY;
    
    if (!keyToUse) {
      return NextResponse.json({ error: 'No Gemini API key provided in environment variables.' }, { status: 401 });
    }

    // Fetch the user's entire profile
    const [skills, experience, education, projects] = await Promise.all([
        prisma.skill.findMany(),
        prisma.experience.findMany(),
        prisma.education.findMany(),
        prisma.project.findMany()
    ]);

    const profileData = { skills, experience, education, projects };
    const profileString = JSON.stringify(profileData, null, 2);

    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
Do not include markdown code blocks like \`\`\`json. Just the raw JSON array.

User Profile:
${profileString}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestedJobs = JSON.parse(cleanedText);

    return NextResponse.json({ data: suggestedJobs }, { status: 200 });
  } catch (error: any) {
    console.error('Suggest jobs error:', error);
    return NextResponse.json({ error: error.message || 'Failed to suggest jobs' }, { status: 500 });
  }
}
