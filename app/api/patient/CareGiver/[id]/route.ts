import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Caregiver ID parameter is missing' },
                { status: 400 }
            );
        }

        const caregiver = await Caregiver.findById(id).select('-password');

        if (!caregiver) {
            return NextResponse.json(
                { error: 'Caregiver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, caregiver }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}