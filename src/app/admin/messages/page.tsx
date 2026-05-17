import { prisma } from '@/lib/prisma';
import MessagesClient from './MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const serializedMessages = messages.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
    }));

    return <MessagesClient initialMessages={serializedMessages} />;
}
