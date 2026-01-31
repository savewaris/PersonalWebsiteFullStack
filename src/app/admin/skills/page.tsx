import { prisma } from '@/lib/prisma';
import SkillsClient from './SkillsClient';

export default async function SkillsPage() {
    const skills = await prisma.skill.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return <SkillsClient initialSkills={skills} />;
}
