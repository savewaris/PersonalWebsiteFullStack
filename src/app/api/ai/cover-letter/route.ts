import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetJob, applicantName, hiringManager, companyName, hrEmail, language = 'en' } = body;

    if (!targetJob?.title) {
      return NextResponse.json({ error: 'No target job provided' }, { status: 400 });
    }

    const keyToUse = process.env.GEMINI_API_KEY;
    if (!keyToUse) {
      return NextResponse.json({ error: 'No Gemini API key configured.' }, { status: 401 });
    }

    // Fetch minimal profile — cover letters care most about experience + projects + top skills
    const [skills, experience, projects] = await Promise.all([
      prisma.skill.findMany({ take: 15, orderBy: { proficiency: 'desc' } }),
      prisma.experience.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.project.findMany({ take: 5 }),
    ]);

    const profileSummary = JSON.stringify({ skills, experience, projects }, null, 2);

    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
2. วรรคที่ 2: เชื่อมประสบการณ์หรือโปรเจกต์ที่โดดเด่น 2-3 รายการกับความต้องการของงาน ใช้ตัวเลขผลลัพธ์ถ้ามีในข้อมูล
3. วรรคที่ 3: เน้นทักษะ 2-3 รายการที่เกี่ยวข้องซึ่งทำให้ผู้สมัครเหมาะสมกับตำแหน่ง
4. วรรคปิด: แสดงความกระตือรือร้นอย่างจริงใจ ขอนัดสัมภาษณ์ และจบด้วยคำลงท้ายที่เป็นมืออาชีพ
5. ใช้ภาษาไทยที่เป็นทางการแต่เป็นมนุษย์ มีความมั่นใจแต่ไม่โอ้อวด ความยาว 3-4 วรรค
6. ส่งคืนเฉพาะ Markdown เท่านั้น ไม่ต้องใส่ code fence

รูปแบบ:
---
**${applicantName || '[ชื่อผู้สมัคร]'}**
[วันที่ — ใช้วันที่ปัจจุบัน]

**${hiringManager || '[ผู้จัดการฝ่ายบุคคล]'}**
**${companyName || '[ชื่อบริษัท]'}**${hrEmail ? `\n**อีเมล: ${hrEmail}**` : ''}

เรียน ${hiringManager || 'ผู้จัดการฝ่ายบุคคล'},

[เนื้อหา]

ขอแสดงความนับถือ,
**${applicantName || '[ชื่อผู้สมัคร]'}**
---
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
1. Open with a strong hook — reference the specific role and company by name.
2. Paragraph 2: Map their 2–3 most impressive experiences/projects directly to the job's needs. Use concrete numbers/outcomes where the profile data supports it.
3. Paragraph 3: Highlight 2–3 relevant skills from their profile that make them the ideal candidate. Be specific, not generic.
4. Closing paragraph: Express genuine enthusiasm, request an interview, and end with a professional sign-off.
5. Tone: Professional but human. Confident, not arrogant. 3–4 paragraphs max.
6. Return ONLY raw Markdown. Do NOT wrap in code fences.

Format:
---
**${applicantName || '[Applicant Name]'}**
[Date — use today's date]

**${hiringManager || '[Hiring Manager]'}**
**${companyName || '[Company Name]'}**${hrEmail ? `\n**Email: ${hrEmail}**` : ''}

Dear ${hiringManager || 'Hiring Manager'},

[Body]

Sincerely,
**${applicantName || '[Applicant Name]'}**
---
      `;

    const result = await model.generateContent(prompt);
    let letter = result.response.text();

    // Strip any accidental code fences
    letter = letter.replace(/^```(markdown)?\n?/i, '').replace(/\n?```$/i, '').trim();

    return NextResponse.json({ data: letter }, { status: 200 });
  } catch (error: any) {
    console.error('Cover letter error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate cover letter' }, { status: 500 });
  }
}
