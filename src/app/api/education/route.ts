import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const data = await prisma.education.findMany({
            orderBy: { startDate: 'desc' },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching education' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { institution, degree, fieldOfStudy, faculty, startDate, endDate, score } = body;
        const data = await prisma.education.create({
            data: {
                institution,
                degree,
                fieldOfStudy,
                faculty: faculty || null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                score,
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating education' }, { status: 500 });
    }
}
