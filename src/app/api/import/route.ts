import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { text, apiKey } = body;

    if (!text) {
      return NextResponse.json({ error: 'No text or URL provided' }, { status: 400 });
    }

    // Check if the input is a URL
    const isUrl = text.trim().startsWith('http://') || text.trim().startsWith('https://');
    let textToParse = text;

    if (isUrl) {
      try {
        const url = text.trim();
        const response = await fetch(url, {
          headers: {
            // Add some basic headers to mimic a browser
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch URL. Status: ${response.status}`);
        }

        const html = await response.text();
        
        // Load HTML into Cheerio
        const $ = cheerio.load(html);
        
        // Remove script and style elements
        $('script, style, noscript').remove();
        
        // Extract text and replace multiple spaces/newlines with a single space
        textToParse = $('body').text().replace(/\s+/g, ' ').trim();
        
        if (!textToParse) {
           throw new Error("Could not extract any readable text from the provided URL.");
        }
      } catch (err: any) {
        // Node's fetch throws an error about init["status"] if the server returns 999 (like LinkedIn does for bots)
        const isBlocked = err.message.includes('init["status"]') || err.message.includes('999');
        const detailMessage = isBlocked ? 'The website blocked the request (HTTP 999).' : err.message;
        
        return NextResponse.json({ 
          error: `Failed to scrape URL. Note that platforms like LinkedIn block automated scrapers. Consider copying and pasting the raw text instead. Details: ${detailMessage}` 
        }, { status: 400 });
      }
    }

    // Use provided key or fallback to env var
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    
    if (!keyToUse) {
      return NextResponse.json({ error: 'No Gemini API key provided or found in environment variables.' }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert resume and profile parser. Extract the following information from the provided text into a strict JSON format. 
The text might be copy-pasted from LinkedIn, JobsDB, or scraped from a website/resume.

CRITICAL: You must actively INFER skills from the job descriptions if an explicit skills section is not provided. 
Extract EVERYTHING you can find to build a complete profile.

JSON Structure:
{
  "experiences": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "location": "Location (if any)",
      "startDate": "YYYY-MM-DDT00:00:00Z" (ISO-8601 format, guess the day if only month/year provided),
      "endDate": "YYYY-MM-DDT00:00:00Z" (ISO-8601 format, null if Present/Current),
      "description": "Brief summary of responsibilities in markdown format"
    }
  ],
  "education": [
    {
      "institution": "University/School Name",
      "degree": "Degree (e.g. Bachelor's, Master's)",
      "fieldOfStudy": "Field of Study",
      "startDate": "YYYY-MM-DDT00:00:00Z",
      "endDate": "YYYY-MM-DDT00:00:00Z",
      "score": "GPA or Grade (if any, otherwise null)"
    }
  ],
  "skills": [
    {
      "name": "Skill Name (e.g. React, Python, Project Management)",
      "proficiency": 80 (Number between 0 and 100, guess based on context or default to 50),
      "category": "Frontend, Backend, Tools, Soft Skills, etc."
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description of the project",
      "tags": "Comma separated tags like 'React, Node, SQL'"
    }
  ],
  "languages": [
    {
      "name": "Language Name (e.g. English, Thai)",
      "proficiency": "Proficiency level (e.g. Native, Fluent, Intermediate, Beginner)"
    }
  ],
  "hobbies": [
    {
      "name": "Hobby Name",
      "emoji": "A single relevant emoji (e.g. 📸, 🎮)"
    }
  ],
  "interests": [
    {
      "name": "Interest Name",
      "emoji": "A single relevant emoji (e.g. 🤖, 🚀)"
    }
  ]
}

Return ONLY valid JSON. Do not include markdown code blocks like \`\`\`json. Just the raw JSON object.


Text to parse:
"""
${textToParse}
"""
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model still includes it
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedText);

    return NextResponse.json({ data: parsedData }, { status: 200 });
  } catch (error: any) {
    console.error('Import parsing error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse text' }, { status: 500 });
  }
}
