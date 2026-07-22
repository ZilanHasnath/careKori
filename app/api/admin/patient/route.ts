import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';

export async function GET() {
    try {
        await dbConnect();
        const patients = await Patient.find({}).select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: patients }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch patients' },
            { status: 500 }
        );
    }
}