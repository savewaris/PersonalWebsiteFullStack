import { prisma } from '@/lib/prisma';
import ExperienceClient from './ExperienceClient';

export default async function ExperiencePage() {
    const experience = await prisma.experience.findMany({
        orderBy: { startDate: 'desc' },
    });

    return <ExperienceClient initialExperience={experience.map(e => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
    }))} />;
}
