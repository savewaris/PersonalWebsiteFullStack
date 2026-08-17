import * as cheerio from 'cheerio';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';
import { generateGeminiJson } from '@/lib/gemini';

export async function POST(req: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { data: body, error } = await parseJsonBody<{ text?: string; apiKey?: string }>(req);

  if (error || !body?.text?.trim()) {
    return apiError('Text or URL is required', 400);
  }

  const { text, apiKey } = body;
  const isUrl = text.trim().startsWith('http://') || text.trim().startsWith('https://');
  let textToParse = text;

  if (isUrl) {
    try {
      const url = text.trim();
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL with status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      $('script, style, noscript').remove();
      textToParse = $('body').text().replace(/\s+/g, ' ').trim();

      if (!textToParse) {
        throw new Error('Could not extract any readable text from the provided URL.');
      }
    } catch (err: any) {
      const isBlocked = err.message.includes('init["status"]') || err.message.includes('999');
      const detailMessage = isBlocked
        ? 'The website blocked the scraper request (HTTP 999). Please copy and paste the raw text instead.'
        : err.message;
      return apiError(`Failed to fetch content from URL. ${detailMessage}`, 400);
    }
  }

  const prompt = `
You are an expert resume and profile parser. Extract the following information from the provided text into a strict JSON format.
Extract EVERYTHING you can find to build a complete profile.

JSON Structure:
{
  "experiences": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "location": "Location (if any)",
      "startDate": "YYYY-MM-DDT00:00:00Z",
      "endDate": "YYYY-MM-DDT00:00:00Z" (or null if Current/Present),
      "description": "Brief summary in markdown"
    }
  ],
  "education": [
    {
      "institution": "University/School Name",
      "degree": "Degree",
      "fieldOfStudy": "Field of Study",
      "faculty": "Faculty (if any, e.g. Faculty of ICT)",
      "startDate": "YYYY-MM-DDT00:00:00Z",
      "endDate": "YYYY-MM-DDT00:00:00Z",
      "score": "GPA or Grade (or null)"
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "proficiency": 80,
      "category": "Frontend, Backend, Tools, etc."
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description",
      "tags": "React, Node, SQL"
    }
  ],
  "languages": [
    {
      "name": "Language Name",
      "proficiency": "Native, Fluent, Intermediate, or Beginner"
    }
  ],
  "hobbies": [
    {
      "name": "Hobby Name",
      "emoji": "📸"
    }
  ],
  "interests": [
    {
      "name": "Interest Name",
      "emoji": "🤖"
    }
  ]
}

Text to parse:
"""
${textToParse}
"""
  `;

  try {
    const parsedData = await generateGeminiJson<any>(prompt, apiKey);
    return apiSuccess({ data: parsedData });
  } catch (err: any) {
    return apiError('Failed to parse text into profile data', 500, err?.message);
  }
}
