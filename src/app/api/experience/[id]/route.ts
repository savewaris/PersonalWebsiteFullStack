import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { role, company, location, startDate, endDate, description } = body;
        const { id } = await params;

        const experience = await prisma.experience.update({
            where: { id },
            data: {
                role,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
            },
        });
        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.experience.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Experience deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
