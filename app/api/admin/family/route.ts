import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';
import '@/lib/models/Patient';

export async function GET() {
    try {
        await dbConnect();
        const familyMembers = await FamilyMember.find({})
            .select('-password')
            .populate('linkedPatient', 'patientName uniqueId phoneNumber')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: familyMembers }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch family members' },
            { status: 500 }
        );
    }
}