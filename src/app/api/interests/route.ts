import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const data = await prisma.interest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching interests' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, emoji } = body;
        const data = await prisma.interest.create({
            data: { name, emoji },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating interest' }, { status: 500 });
    }
}
