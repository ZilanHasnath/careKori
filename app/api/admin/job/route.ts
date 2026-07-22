import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Jobs';
import '@/lib/models/Patient';
import '@/lib/models/Caregiver';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        type JobStatus = 'Active' | 'pending' | 'Rejected' | 'Finish';
        const validStatuses: JobStatus[] = ['Active', 'pending', 'Rejected', 'Finish'];

        const query: { status?: JobStatus | { $in: JobStatus[] } } = {};

        if (status === 'running') {
            query.status = { $in: ['Active', 'pending'] };
        } else if (status && validStatuses.includes(status as JobStatus)) {
            query.status = status as JobStatus;
        }

        const jobs = await Job.find(query)
            .populate('patientId', 'patientName uniqueId phoneNumber location')
            .populate('caregiverId', 'name phoneNumber location expectedSalary')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: jobs }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}