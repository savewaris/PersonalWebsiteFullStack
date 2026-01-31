import { prisma } from '@/lib/prisma';
import LanguagesClient from './LanguagesClient';

export default async function LanguagesPage() {
    const languages = await prisma.language.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return <LanguagesClient initialLanguages={languages} />;
}
