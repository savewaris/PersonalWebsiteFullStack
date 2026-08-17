import { cookies } from 'next/headers';
import crypto from 'crypto';
import { apiSuccess, apiError, parseJsonBody, isAuthSessionValid } from '@/lib/api-utils';

// In-memory rate limiting map: IP -> { attempts: number, resetTime: number }
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { attempts: 1, resetTime: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  record.attempts += 1;
  return { allowed: true };
}

function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function GET() {
  const isAuthenticated = await isAuthSessionValid();
  return apiSuccess({ authenticated: isAuthenticated });
}

export async function POST(request: Request) {
  // Extract client IP or fallback header
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return apiError(
      `Too many failed login attempts. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`,
      429
    );
  }

  const { data, error } = await parseJsonBody<{ password?: string }>(request);
  if (error || !data?.password) {
    return apiError('Password is required', 400);
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (safeCompare(data.password, ADMIN_PASSWORD)) {
    // Reset rate limit on successful authentication
    resetRateLimit(ip);

    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return apiSuccess({ success: true });
  }

  return apiError('Invalid credentials', 401);
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return apiSuccess({ success: true, message: 'Logged out successfully' });
}
