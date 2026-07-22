import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Jobs';
import Patient from '@/lib/models/Patient';
import Caregiver from '@/lib/models/Caregiver';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { patientId, caregiverId, dateTime } = body;

        if (!patientId || !caregiverId) {
            return NextResponse.json(
                { error: 'Missing required fields: patientId and caregiverId are mandatory' },
                { status: 400 }
            );
        }

        const [patientExists, caregiverExists] = await Promise.all([
            Patient.findById(patientId),
            Caregiver.findById(caregiverId),
        ]);

        if (!patientExists || !caregiverExists) {
            return NextResponse.json(
                { error: 'Invalid patientId or caregiverId provided' },
                { status: 404 }
            );
        }

        const activeJobExists = await Job.findOne({
            patientId,
            caregiverId,
            status: { $in: ['pending', 'Active'] },
        });

        if (activeJobExists) {
            return NextResponse.json(
                { error: 'A pending or active job request already exists between this patient and caregiver' },
                { status: 409 }
            );
        }

        const newJob = await Job.create({
            patientId,
            caregiverId,
            status: 'pending',
            dateTime: dateTime ? new Date(dateTime) : new Date(),
        });

        return NextResponse.json(
            { message: 'Job request submitted successfully', job: newJob },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}