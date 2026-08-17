import { cookies } from 'next/headers';
import { apiSuccess, apiError, parseJsonBody, isAuthSessionValid } from '@/lib/api-utils';

export async function GET() {
  const isAuthenticated = await isAuthSessionValid();
  return apiSuccess({ authenticated: isAuthenticated });
}

export async function POST(request: Request) {
  const { data, error } = await parseJsonBody<{ password?: string }>(request);
  if (error || !data?.password) {
    return apiError('Password is required', 400);
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (data.password === ADMIN_PASSWORD) {
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

  return apiError('Invalid password', 401);
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return apiSuccess({ success: true, message: 'Logged out successfully' });
}
