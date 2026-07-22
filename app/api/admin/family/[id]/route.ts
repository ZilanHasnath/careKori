import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';
import '@/lib/models/Patient';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const familyMember = await FamilyMember.findById(id)
            .select('-password')
            .populate('linkedPatient', 'patientName uniqueId phoneNumber location illness');

        if (!familyMember) {
            return NextResponse.json(
                { success: false, error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: familyMember }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch family member details' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const updatedMember = await FamilyMember.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedMember) {
            return NextResponse.json(
                { success: false, error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedMember }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update family member' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedMember = await FamilyMember.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json(
                { success: false, error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Family member deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete family member' },
            { status: 500 }
        );
    }
}