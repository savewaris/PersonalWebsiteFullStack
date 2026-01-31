import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(skills);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, proficiency, category, icon } = body;

        const skill = await prisma.skill.create({
            data: {
                name,
                proficiency: Number(proficiency),
                category,
                icon,
            },
        });
        return NextResponse.json(skill, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
    }
}
