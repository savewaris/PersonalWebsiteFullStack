import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { apiSuccess, apiError, requireAuthSession } from '@/lib/api-utils';

// Whitelist of allowed MIME types
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

// Extension map fallback
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    
    // Check for single file or batch files
    const singleFile = formData.get('file') as File | null;
    const multiFiles = formData.getAll('files') as File[];
    const rawFiles: File[] = multiFiles.length > 0 ? multiFiles : singleFile ? [singleFile] : [];

    if (rawFiles.length === 0) {
      return apiError('No file provided in form data. Expected "file" or "files" field.', 400);
    }

    const folderParam = formData.get('folder');
    const folder = typeof folderParam === 'string' && /^[a-zA-Z0-9_-]+$/.test(folderParam)
      ? folderParam
      : 'projects';

    const targetDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(targetDir, { recursive: true });

    const uploadedResults: Array<{
      url: string;
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
      mediaType: 'image' | 'video';
    }> = [];

    for (const file of rawFiles) {
      const mimeType = file.type || '';
      const isImage = ALLOWED_IMAGE_TYPES.has(mimeType);
      const isVideo = ALLOWED_VIDEO_TYPES.has(mimeType);

      if (!isImage && !isVideo) {
        return apiError(
          `Unsupported file type: "${mimeType || 'unknown'}". Allowed types: PNG, JPG, WebP, GIF, SVG, MP4, WebM, MOV.`,
          400
        );
      }

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        return apiError(
          `Image file "${file.name}" exceeds maximum allowed size of 10MB (${(file.size / 1024 / 1024).toFixed(2)}MB).`,
          400
        );
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        return apiError(
          `Video file "${file.name}" exceeds maximum allowed size of 50MB (${(file.size / 1024 / 1024).toFixed(2)}MB).`,
          400
        );
      }

      // Generate sanitized unique filename
      const originalExt = path.extname(file.name).replace('.', '').toLowerCase();
      const ext = originalExt || MIME_TO_EXT[mimeType] || (isImage ? 'png' : 'mp4');
      const sanitizedBase = path
        .basename(file.name, path.extname(file.name))
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const filename = `${sanitizedBase}_${uniqueSuffix}.${ext}`;

      const filePath = path.join(targetDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${folder}/${filename}`;

      uploadedResults.push({
        url: publicUrl,
        filename,
        originalName: file.name,
        size: file.size,
        mimeType,
        mediaType: isImage ? 'image' : 'video',
      });
    }

    if (rawFiles.length === 1 && !multiFiles.length) {
      return apiSuccess(uploadedResults[0], 201);
    }

    return apiSuccess({ files: uploadedResults, count: uploadedResults.length }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('[UPLOAD_API_ERROR]:', error);
    return apiError('Failed to process file upload', 500, message);
  }
}
