import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PatientProgress from '@/lib/models/PatientProgress';

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            jobId,
            caregiverId,
            patientId,
            bloodPressure,
            heartRate,
            meals,
            exercise,
            medicineStatus,
            patientMood,
            note,
        } = body;

        if (
            !jobId ||
            !caregiverId ||
            !patientId ||
            !bloodPressure ||
            !heartRate ||
            !meals ||
            !exercise ||
            !medicineStatus ||
            !patientMood ||
            !note
        ) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const newProgress = await PatientProgress.create({
            jobId,
            caregiverId,
            patientId,
            bloodPressure,
            heartRate: Number(heartRate),
            meals,
            exercise,
            medicineStatus,
            patientMood,
            note,
            dateTime: new Date(),
        });

        return NextResponse.json(
            { success: true, progress: newProgress },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to record progress' },
            { status: 500 }
        );
    }
}