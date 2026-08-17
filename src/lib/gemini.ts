import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGeminiModel(customApiKey?: string, modelName: string = 'gemini-2.5-flash') {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No Gemini API key provided or found in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

export function cleanMarkdownCodeFences(text: string): string {
  return text
    .replace(/^```(?:json|markdown)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim();
}

export async function generateGeminiText(prompt: string, customApiKey?: string): Promise<string> {
  const model = getGeminiModel(customApiKey);
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return cleanMarkdownCodeFences(responseText);
}

export async function generateGeminiJson<T>(prompt: string, customApiKey?: string): Promise<T> {
  const rawText = await generateGeminiText(prompt, customApiKey);
  const cleaned = cleanMarkdownCodeFences(rawText);
  return JSON.parse(cleaned) as T;
}
