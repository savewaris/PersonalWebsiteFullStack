import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetJob, language = 'en' } = body;  // language: 'en' | 'th'

    if (!targetJob || !targetJob.title) {
      return NextResponse.json({ error: 'No target job provided' }, { status: 400 });
    }

    const keyToUse = process.env.GEMINI_API_KEY;
    if (!keyToUse) {
      return NextResponse.json({ error: 'No Gemini API key provided in environment variables.' }, { status: 401 });
    }

    // Fetch full profile
    const [skills, experience, education, projects, languages] = await Promise.all([
      prisma.skill.findMany(),
      prisma.experience.findMany(),
      prisma.education.findMany(),
      prisma.project.findMany(),
      prisma.language.findMany(),
    ]);

    const profileData = { skills, experience, education, projects, languages };
    const profileString = JSON.stringify(profileData, null, 2);

    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const isThai = language === 'th';

    const prompt = isThai
      ? `
คุณคือผู้เชี่ยวชาญด้านการเขียน Resume ภาษาไทยระดับมืออาชีพ กรุณาสร้าง CV ภาษาไทยในรูปแบบ Markdown สำหรับผู้สมัครงาน โดยอ้างอิงจากข้อมูล Profile ที่ให้มาเท่านั้น
ปรับแต่ง CV ให้เหมาะสมกับตำแหน่ง: "${targetJob.title}"

คำแนะนำ:
1. เขียน "สรุปโปรไฟล์" ที่น่าสนใจซึ่งแสดงถึงความเหมาะสมกับตำแหน่ง "${targetJob.title}"
2. จัดโครงสร้าง Markdown อย่างสวยงาม ใช้หัวข้อ (#, ##, ###) รายการ และ **ตัวหนา** เพื่อเน้นความสำคัญ
3. เรียงลำดับทักษะ ประสบการณ์ และโปรเจกต์ที่เกี่ยวข้องกับตำแหน่งงานมากที่สุดไว้ก่อน
4. ใช้ภาษาที่เป็นทางการและเป็นมืออาชีพ ห้ามแต่งเติมข้อมูลที่ไม่มีใน Profile
5. ใช้โครงสร้างดังนี้:
   - # เรซูเม่มืออาชีพ
   - ## สรุปโปรไฟล์
   - ## ทักษะหลัก
   - ## ประสบการณ์การทำงาน
   - ## โปรเจกต์สำคัญ
   - ## การศึกษาและภาษา

ส่งคืนเฉพาะ Markdown เท่านั้น ไม่ต้องใส่ \`\`\`markdown

ข้อมูล Profile ของผู้สมัคร:
${profileString}
      `
      : `
You are an expert resume writer. Generate a professional Markdown CV for the user based strictly on their profile data provided below. 
Tailor the CV specifically for the role of: "${targetJob.title}".

Instructions:
1. Write a compelling Professional Summary at the top that highlights their alignment with the "${targetJob.title}" role.
2. Structure the Markdown beautifully using standard headings (#, ##, ###), bullet points, and bold text for emphasis.
3. Reorder and highlight the skills, experiences, and projects that are MOST relevant to the target job.
4. Keep the tone strictly professional, factual (do not invent experiences), and impactful.
5. Use this general structure:
   - # Professional Resume
   - ## Professional Summary
   - ## Core Competencies (List relevant skills)
   - ## Professional Experience (Format clearly with dates)
   - ## Key Projects
   - ## Education & Languages

Return ONLY the raw Markdown text. Do not wrap in \`\`\`markdown code blocks.

User Profile Data:
${profileString}
      `;

    const result = await model.generateContent(prompt);
    let markdownResume = result.response.text();

    // Clean potential markdown blocks
    markdownResume = markdownResume
      .replace(/^```(markdown)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    return NextResponse.json({ data: markdownResume }, { status: 200 });
  } catch (error: any) {
    console.error('Tailor resume error:', error);
    return NextResponse.json({ error: error.message || 'Failed to tailor resume' }, { status: 500 });
  }
}
