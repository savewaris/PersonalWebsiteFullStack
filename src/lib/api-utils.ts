import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ensureHttps } from './url-utils';

export { ensureHttps };

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers });
}

export function apiError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function revalidatePortfolioData() {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/admin', 'layout');
  } catch (err) {
    console.error('Revalidation error:', err);
  }
}

export async function isAuthSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'true';
}

export async function requireAuthSession() {
  const isValid = await isAuthSessionValid();
  if (!isValid) {
    return apiError('Unauthorized: Admin session required', 401);
  }
  return null;
}

export async function parseJsonBody<T>(req: Request): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = (await req.json()) as T;
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON body';
    return { data: null, error: message };
  }
}
