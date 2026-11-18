import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

const UPLOADS_URL_PREFIX = '/uploads/resumes/';
export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export function isPdf(file: File) {
  return file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
}

/** Sanitizes the name, writes the PDF to public/uploads/resumes/ and returns its DB fields. */
export async function saveResumeFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const sanitizedBase = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
  const fileName = `${Date.now()}-${sanitizedBase}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);
  return { fileName, fileUrl: `${UPLOADS_URL_PREFIX}${fileName}`, fileSize: buffer.length };
}

/** Best-effort removal of a previously uploaded local file; external URLs are left alone. */
export function removeResumeFile(fileUrl: string) {
  if (!fileUrl.startsWith(UPLOADS_URL_PREFIX)) return;
  unlink(path.join(process.cwd(), 'public', fileUrl)).catch(() => {});
}
