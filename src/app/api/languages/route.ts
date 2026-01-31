import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const data = await prisma.language.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching languages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, proficiency } = body;
        const data = await prisma.language.create({
            data: { name, proficiency },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating language' }, { status: 500 });
    }
}
