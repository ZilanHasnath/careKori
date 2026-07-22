import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import FamilyMember from '@/lib/models/FamilyMember';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        if (!FamilyMember) { }

        const { id } = await params;

        let patient = await Patient.findById(id)
            .select('-password')
            .populate({ path: 'linkedFamilyMembers', select: '-password' });

        if (!patient) {
            patient = await Patient.findOne({ uniqueId: id })
                .select('-password')
                .populate({ path: 'linkedFamilyMembers', select: '-password' });
        }

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: patient }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch patient details' }, { status: 500 });
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

        const updatedPatient = await Patient.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedPatient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedPatient }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update patient' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedPatient = await Patient.findByIdAndDelete(id);

        if (!deletedPatient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Patient deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete patient' }, { status: 500 });
    }
}