import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

/**
 * Validates whether the incoming request is authenticated as admin
 * either via the admin session cookie or via an Authorization Bearer token (for plugin adapter).
 */
async function authenticateAdminOrBearer(request: Request): Promise<boolean> {
  // 1. Check Bearer token in Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const adminSecret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    if (adminSecret && token === adminSecret) {
      return true;
    }
  }

  // 2. Check session cookie
  const sessionError = await requireAuthSession();
  return !sessionError;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const isAuthenticated = await authenticateAdminOrBearer(request);

    const whereClause = !isAuthenticated || !includeInactive ? { isActive: true } : {};

    const resumes = await prisma.resume.findMany({
      where: whereClause,
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return apiSuccess(resumes);
  } catch (error: any) {
    return apiError('Failed to fetch resumes', 500, error?.message);
  }
}

export async function POST(request: Request) {
  const isAuthed = await authenticateAdminOrBearer(request);
  if (!isAuthed) {
    return apiError('Unauthorized: Admin session or valid Bearer token required', 401);
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    let title = 'Resume';
    let roleCategory = 'General';
    let fileUrl = '';
    let fileName = '';
    let fileSize: number | undefined = undefined;
    let isPrimary = false;
    let isActive = true;
    let order = 0;

    // Handle Multipart Form Upload (from Admin UI or CLI plugin)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return apiError('No file provided in form data', 400);
      }

      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        return apiError('Invalid file type: Only PDF resumes are accepted', 400);
      }

      title = (formData.get('title') as string) || file.name.replace(/\.[^/.]+$/, '');
      roleCategory = (formData.get('roleCategory') as string) || 'General';
      isPrimary = formData.get('isPrimary') === 'true';
      isActive = formData.get('isActive') !== 'false';
      order = parseInt(formData.get('order') as string, 10) || 0;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileSize = buffer.length;

      // Sanitize filename & save to public/uploads/resumes/
      const sanitizedBase = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-')
        .replace(/-+/g, '-');
      fileName = `${Date.now()}-${sanitizedBase}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/resumes/${fileName}`;
    } else {
      // Handle JSON payload (for external plugin adapter)
      const body = await request.json();
      if (!body.fileUrl) {
        return apiError('fileUrl is required for external JSON payload', 400);
      }
      title = body.title || 'Resume';
      roleCategory = body.roleCategory || 'General';
      fileUrl = body.fileUrl;
      fileName = body.fileName || path.basename(fileUrl);
      fileSize = body.fileSize;
      isPrimary = Boolean(body.isPrimary);
      isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
      order = body.order || 0;
    }

    // If this resume is primary, unset any existing primary resumes
    if (isPrimary) {
      await prisma.resume.updateMany({
        where: { isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const newResume = await prisma.resume.create({
      data: {
        title,
        roleCategory,
        fileUrl,
        fileName,
        fileSize,
        isPrimary,
        isActive,
        order,
      },
    });

    revalidatePortfolioData();
    return apiSuccess({ success: true, data: newResume, ...newResume }, 201);
  } catch (error: any) {
    console.error('[API_RESUMES_POST_ERROR]:', error);
    return apiError('Failed to create resume', 500, error?.message);
  }
}
