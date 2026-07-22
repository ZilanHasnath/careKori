import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/lib/models/Jobs';

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { status: 'Active' },
            { new: true }
        );

        if (!updatedJob) {
            return NextResponse.json({ error: 'Job request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, job: updatedJob }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to accept job' }, { status: 500 });
    }
}