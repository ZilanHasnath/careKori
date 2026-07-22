import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PatientProgress from '@/lib/models/PatientProgress';
import '@/lib/models/Patient';
import '@/lib/models/Jobs';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');
        const caregiverId = searchParams.get('caregiverId');

        if (!patientId) {
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }

        const query: { patientId: string; caregiverId?: string } = { patientId };
        if (caregiverId) {
            query.caregiverId = caregiverId;
        }

        const history = await PatientProgress.find(query)
            .populate('patientId', 'name phoneNumber location')
            .sort({ dateTime: -1 });

        return NextResponse.json({ success: true, history }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch patient progress history' },
            { status: 500 }
        );
    }
}