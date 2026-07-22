import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        const location = searchParams.get('location');
        const specialty = searchParams.get('specialty');
        const sex = searchParams.get('sex');

        const query: any = {
            accountType: { $in: ['Approved', 'approved'] }
        };

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (sex) {
            query.sex = sex;
        }

        if (specialty) {
            query.experience = { $regex: specialty, $options: 'i' };
        }

        const caregivers = await Caregiver.find(query).select('-password');

        return NextResponse.json(
            { success: true, count: caregivers.length, caregivers },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}