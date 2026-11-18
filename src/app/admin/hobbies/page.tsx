import { prisma } from '@/lib/prisma';
import HobbiesClient from './HobbiesClient';

export default async function HobbiesPage() {
    const hobbies = await prisma.hobby.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return <HobbiesClient initialHobbies={hobbies} />;
}
