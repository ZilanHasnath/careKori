import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Jobs';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json(
                { error: 'Missing patientId query parameter' },
                { status: 400 }
            );
        }

        const requests = await Job.find({ patientId })
            .populate({
                model: Caregiver,
                path: 'caregiverId',
                select: 'name phoneNumber email location expectedSalary experience sex',
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, count: requests.length, requests },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}