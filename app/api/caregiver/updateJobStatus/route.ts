import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Jobs';

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { jobId, status } = body;

        if (!jobId || !status) {
            return NextResponse.json(
                { error: 'jobId and status are required fields' },
                { status: 400 }
            );
        }

        const validStatuses = ['pending', 'Active', 'Rejected', 'Finish'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return NextResponse.json(
                { error: 'Job request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: `Job status updated to ${status} successfully`, job: updatedJob },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}