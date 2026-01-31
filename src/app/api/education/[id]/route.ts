import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { institution, degree, fieldOfStudy, startDate, endDate, score } = body;
        const data = await prisma.education.update({
            where: { id },
            data: {
                institution,
                degree,
                fieldOfStudy,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                score,
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating education' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.education.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting education' }, { status: 500 });
    }
}
