import { prisma } from '@/lib/prisma';
import { saveResumeFile, removeResumeFile, isPdf, MAX_RESUME_BYTES } from '@/lib/resume-files';
import { apiSuccess, apiError, parseJsonBody, requireAuthSession, revalidatePortfolioData } from '@/lib/api-utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;
  type Body = { title?: string; roleCategory?: string; isPrimary?: boolean; isActive?: boolean; order?: number };

  // Accepts JSON (quick toggles) or multipart (edit form, optionally with a replacement PDF).
  let data: Body | null = null;
  let newFile: File | null = null;
  if ((request.headers.get('content-type') || '').includes('multipart/form-data')) {
    const form = await request.formData();
    const file = form.get('file');
    if (file instanceof File && file.size > 0) newFile = file;
    const order = parseInt(form.get('order') as string, 10);
    data = {
      title: (form.get('title') as string) || undefined,
      roleCategory: (form.get('roleCategory') as string) || undefined,
      isPrimary: form.has('isPrimary') ? form.get('isPrimary') === 'true' : undefined,
      isActive: form.has('isActive') ? form.get('isActive') === 'true' : undefined,
      order: Number.isNaN(order) ? undefined : order,
    };
  } else {
    const parsed = await parseJsonBody<Body>(request);
    if (parsed.error || !parsed.data) return apiError('Invalid request body', 400);
    data = parsed.data;
  }

  if (newFile) {
    if (!isPdf(newFile)) return apiError('Invalid file type: Only PDF resumes are accepted', 400);
    if (newFile.size > MAX_RESUME_BYTES) return apiError('File size exceeds 10MB limit', 400);
  }

  try {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Resume not found', 404);
    }

    if (data.isPrimary) {
      // Unset existing primary resumes
      await prisma.resume.updateMany({
        where: { id: { not: id }, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const saved = newFile ? await saveResumeFile(newFile) : null;

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        ...(saved ?? {}),
        title: data.title !== undefined ? data.title : existing.title,
        roleCategory: data.roleCategory !== undefined ? data.roleCategory : existing.roleCategory,
        isPrimary: data.isPrimary !== undefined ? data.isPrimary : existing.isPrimary,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
        order: data.order !== undefined ? data.order : existing.order,
      },
    });

    if (saved) removeResumeFile(existing.fileUrl);

    revalidatePortfolioData();
    return apiSuccess(updated);
  } catch (err: any) {
    return apiError('Failed to update resume', 500, err?.message);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  const { id } = await params;

  try {
    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Resume not found', 404);
    }

    // Delete record from DB
    await prisma.resume.delete({ where: { id } });

    // Clean up local file from disk if it lives in /uploads/resumes/
    removeResumeFile(existing.fileUrl);

    revalidatePortfolioData();
    return apiSuccess({ deleted: true, id });
  } catch (err: any) {
    return apiError('Failed to delete resume', 500, err?.message);
  }
}
