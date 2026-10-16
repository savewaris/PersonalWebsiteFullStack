import { prisma } from '@/lib/prisma';
import LanguagesClient from './LanguagesClient';

export default async function LanguagesPage() {
    const languages = await prisma.language.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return <LanguagesClient initialLanguages={languages} />;
}
