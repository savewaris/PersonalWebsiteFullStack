import { prisma } from '@/lib/prisma';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return <ProjectsClient initialProjects={projects} />;
}
