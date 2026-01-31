import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { name, proficiency, category, icon } = body;
        const { id } = await params;

        const skill = await prisma.skill.update({
            where: { id },
            data: {
                name,
                proficiency: Number(proficiency),
                category,
                icon,
            },
        });
        return NextResponse.json(skill);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.skill.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Skill deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
    }
}
