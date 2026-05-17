import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { read } = body;

        const data = await prisma.message.update({
            where: { id },
            data: { read },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating message' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting message' }, { status: 500 });
    }
}
