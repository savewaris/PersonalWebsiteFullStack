import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { startDate: 'desc' },
        });
        return NextResponse.json(experiences);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { role, company, location, startDate, endDate, description } = body;

        const experience = await prisma.experience.create({
            data: {
                role,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
            },
        });
        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
    }
}
