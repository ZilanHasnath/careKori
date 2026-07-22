import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const accountType = searchParams.get('accountType');

        const query: { accountType?: 'Pending' | 'Approved' } = {};

        if (accountType === 'Pending' || accountType === 'Approved') {
            query.accountType = accountType;
        }

        const caregivers = await Caregiver.find(query).select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: caregivers }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch caregivers' },
            { status: 500 }
        );
    }
}