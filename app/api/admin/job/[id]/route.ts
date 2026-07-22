import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Jobs';
import '@/lib/models/Patient';
import '@/lib/models/Caregiver';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const job = await Job.findById(id)
            .populate('patientId', 'patientName uniqueId phoneNumber location illness age sex')
            .populate('caregiverId', 'name phoneNumber location experience nationalIdPassportNo');

        if (!job) {
            return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: job }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch job details' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const updatedJob = await Job.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
            .populate('patientId', 'patientName uniqueId phoneNumber location')
            .populate('caregiverId', 'name phoneNumber location');

        if (!updatedJob) {
            return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedJob }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update job' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Job deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
    }
}