import { prisma } from '@/lib/prisma';
import InterestsClient from './InterestsClient';

export default async function InterestsPage() {
    const interests = await prisma.interest.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return <InterestsClient initialInterests={interests} />;
}
