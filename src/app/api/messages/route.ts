import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                name,
                email,
                message,
            },
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: 'Error processing message' }, { status: 500 });
    }
}
