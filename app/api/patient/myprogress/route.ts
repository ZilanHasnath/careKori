import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db'; 
import ProgressLog from '@/lib/models/PatientProgress'; 

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();


        const progressLogs = await ProgressLog.find({ patientId })
            .sort({ dateTime: 1, createdAt: 1 })
            .lean();

        return NextResponse.json(
            { success: true, progress: progressLogs },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching patient progress:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}