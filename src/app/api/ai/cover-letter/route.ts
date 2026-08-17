import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';
import { generateGeminiText } from '@/lib/gemini';

export async function POST(req: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data: body, error } = await parseJsonBody<{
    targetJob?: { title: string; description?: string; keywords?: string[] };
    applicantName?: string;
    hiringManager?: string;
    companyName?: string;
    hrEmail?: string;
    language?: 'en' | 'th';
    apiKey?: string;
  }>(req);

  if (error || !body?.targetJob?.title) {
    return apiError('Target job title is required', 400);
  }

  const { targetJob, applicantName, hiringManager, companyName, hrEmail, language = 'en', apiKey } = body;

  try {
    const [skills, experience, projects] = await Promise.all([
      prisma.skill.findMany({ take: 15, orderBy: { proficiency: 'desc' } }),
      prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.project.findMany({ take: 5 }),
    ]);

    const profileSummary = JSON.stringify({ skills, experience, projects }, null, 2);
    const isThai = language === 'th';

    const prompt = isThai
      ? `
คุณคือผู้เชี่ยวชาญด้านการเขียน Cover Letter ภาษาไทยระดับมืออาชีพ กรุณาเขียน Cover Letter ภาษาไทยที่น่าสนใจและเป็นส่วนตัวในรูปแบบ Markdown สำหรับผู้สมัครงานต่อไปนี้

ตำแหน่งงานที่สมัคร: "${targetJob.title}"
บริษัท: "${companyName || 'บริษัท'}"
ผู้จัดการฝ่ายบุคคล: "${hiringManager || 'ผู้จัดการฝ่ายบุคคล'}"
ชื่อผู้สมัคร: "${applicantName || 'ผู้สมัคร'}"
รายละเอียดงาน: ${targetJob.description || ''}
คำสำคัญที่ควรนำไปใช้: ${targetJob.keywords?.join(', ') || ''}

ข้อมูล Profile ของผู้สมัคร:
${profileSummary}

คำแนะนำ:
1. เปิดด้วยประโยคที่โดดเด่นและน่าสนใจ กล่าวถึงตำแหน่งและบริษัทโดยตรง
2. วรรคที่ 2: เชื่อมประสบการณ์หรือโปรเจกต์ที่โดดเด่น 2-3 รายการกับความต้องการของงาน
3. วรรคที่ 3: เน้นทักษะ 2-3 รายการที่เกี่ยวข้อง
4. วรรคปิด: แสดงความกระตือรือร้นอย่างจริงใจ ขอนัดสัมภาษณ์
5. ส่งคืนเฉพาะ Markdown เท่านั้น
      `
      : `
You are an expert career coach and professional writer. Write a compelling, personalized cover letter in Markdown for the applicant below.

Target Role: "${targetJob.title}"
Company: "${companyName || 'the company'}"
Hiring Manager: "${hiringManager || 'Hiring Manager'}"
Applicant Name: "${applicantName || 'the applicant'}"
Job Description Context: ${targetJob.description || ''}
Keywords to incorporate naturally: ${targetJob.keywords?.join(', ') || ''}

Applicant Profile:
${profileSummary}

Instructions:
1. Open with a strong hook referencing role and company.
2. Paragraph 2: Map 2–3 impressive experiences/projects to the job.
3. Paragraph 3: Highlight 2–3 relevant skills.
4. Closing: Request interview with professional sign-off.
5. Return ONLY raw Markdown.
      `;

    const letter = await generateGeminiText(prompt, apiKey);
    return apiSuccess({ data: letter });
  } catch (err: any) {
    return apiError('Failed to generate cover letter', 500, err?.message);
  }
}
