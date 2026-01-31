import { prisma } from '@/lib/prisma';
import EducationClient from './EducationClient';

export default async function EducationPage() {
    const education = await prisma.education.findMany({
        orderBy: { startDate: 'desc' },
    });

    // Fix connection with dates issue by converting to strings
    const serializedEducation = education.map(e => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
    }));

    return <EducationClient initialEducation={serializedEducation} />;
}
