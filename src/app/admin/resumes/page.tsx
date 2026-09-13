import { getAllResumes } from '@/lib/data/resumes';
import ResumesClient from './ResumesClient';

export default async function ResumesPage() {
  const resumes = await getAllResumes();
  const serializedResumes = resumes.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return <ResumesClient initialResumes={serializedResumes} />;
}
