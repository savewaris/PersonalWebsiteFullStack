import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession } from '@/lib/api-utils';

export async function GET() {
  const authError = await requireAuthSession();
  if (authError) return authError;

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(messages);
  } catch (error: any) {
    return apiError('Failed to fetch messages', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const { data, error } = await parseJsonBody<{
    name?: string;
    email?: string;
    message?: string;
  }>(request);

  if (error || !data?.name || !data?.email || !data?.message) {
    return apiError('Name, email, and message are required fields', 400);
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return apiError('Please provide a valid email address', 400);
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim(),
      },
    });
    return apiSuccess(newMessage, 201);
  } catch (err: any) {
    return apiError('Failed to send message', 500, err?.message);
  }
}
