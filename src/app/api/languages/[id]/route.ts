import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, proficiency } = body;
        const data = await prisma.language.update({
            where: { id },
            data: { name, proficiency },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating language' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.language.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting language' }, { status: 500 });
    }
}
