import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, emoji } = body;
        const data = await prisma.interest.update({
            where: { id },
            data: { name, emoji },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating interest' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.interest.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting interest' }, { status: 500 });
    }
}
