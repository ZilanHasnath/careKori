import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PatientProgress from '@/lib/models/PatientProgress';
import Patient from '@/lib/models/Patient';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json(
                { error: 'Patient ID parameter is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const progressLogs = await PatientProgress.find({ patientId })
            .populate({
                path: 'patientId',
                model: Patient,
                select: 'patientName uniqueId',
            })
            .sort({ dateTime: -1 });

        return NextResponse.json(
            { success: true, logs: progressLogs },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}