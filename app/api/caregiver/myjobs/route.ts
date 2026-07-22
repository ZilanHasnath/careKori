import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/lib/models/Jobs';
import '@/lib/models/Patient';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const caregiverId = searchParams.get('caregiverId');

        if (!caregiverId) {
            return NextResponse.json({ error: 'Caregiver ID is required' }, { status: 400 });
        }

        const jobs = await Job.find({ caregiverId })
            .populate('patientId', 'name phoneNumber location email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, jobs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch job requests' }, { status: 500 });
    }
}