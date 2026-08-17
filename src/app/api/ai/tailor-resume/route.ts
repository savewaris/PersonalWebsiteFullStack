import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';
import { generateGeminiText } from '@/lib/gemini';

export async function POST(req: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data: body, error } = await parseJsonBody<{
    targetJob?: { title: string };
    language?: 'en' | 'th';
    apiKey?: string;
  }>(req);

  if (error || !body?.targetJob?.title) {
    return apiError('Target job title is required', 400);
  }

  const { targetJob, language = 'en', apiKey } = body;

  try {
    const [skills, experience, education, projects, languages] = await Promise.all([
      prisma.skill.findMany(),
      prisma.experience.findMany(),
      prisma.education.findMany(),
      prisma.project.findMany(),
      prisma.language.findMany(),
    ]);

    const profileData = { skills, experience, education, projects, languages };
    const profileString = JSON.stringify(profileData, null, 2);
    const isThai = language === 'th';

    const prompt = isThai
      ? `
คุณคือผู้เชี่ยวชาญด้านการเขียน Resume ภาษาไทยระดับมืออาชีพ กรุณาสร้าง CV ภาษาไทยในรูปแบบ Markdown สำหรับผู้สมัครงาน โดยอ้างอิงจากข้อมูล Profile ที่ให้มาเท่านั้น
ปรับแต่ง CV ให้เหมาะสมกับตำแหน่ง: "${targetJob.title}"

คำแนะนำ:
1. เขียน "สรุปโปรไฟล์" ที่น่าสนใจซึ่งแสดงถึงความเหมาะสมกับตำแหน่ง "${targetJob.title}"
2. จัดโครงสร้าง Markdown อย่างสวยงาม ใช้หัวข้อ (#, ##, ###) รายการ และ **ตัวหนา** เพื่อเน้นความสำคัญ
3. เรียงลำดับทักษะ ประสบการณ์ และโปรเจกต์ที่เกี่ยวข้องกับตำแหน่งงานมากที่สุดไว้ก่อน
4. โครงสร้าง: # เรซูเม่มืออาชีพ, ## สรุปโปรไฟล์, ## ทักษะหลัก, ## ประสบการณ์การทำงาน, ## โปรเจกต์สำคัญ, ## การศึกษาและภาษา
5. ส่งคืนเฉพาะ Markdown เท่านั้น

ข้อมูล Profile:
${profileString}
      `
      : `
You are an expert resume writer. Generate a professional Markdown CV for the user based strictly on their profile data provided below. 
Tailor the CV specifically for the role of: "${targetJob.title}".

Instructions:
1. Write a compelling Professional Summary at the top that highlights their alignment with the "${targetJob.title}" role.
2. Structure the Markdown beautifully using standard headings (#, ##, ###), bullet points, and bold text for emphasis.
3. Reorder and highlight the skills, experiences, and projects that are MOST relevant to the target job.
4. Structure: # Professional Resume, ## Professional Summary, ## Core Competencies, ## Professional Experience, ## Key Projects, ## Education & Languages.
5. Return ONLY the raw Markdown text.

User Profile Data:
${profileString}
      `;

    const markdownResume = await generateGeminiText(prompt, apiKey);
    return apiSuccess({ data: markdownResume });
  } catch (err: any) {
    return apiError('Failed to tailor resume', 500, err?.message);
  }
}
