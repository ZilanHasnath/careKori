import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import FamilyMember from '@/lib/models/FamilyMember';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }

        const patient = await Patient.findById(id)
            .populate({
                path: 'linkedFamilyMembers',
                model: FamilyMember,
                select: '-password',
            })
            .select('-password');

        if (!patient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ patient }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id, patientName, phoneNumber, email, age, sex, location, illness } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Patient ID is required' },
                { status: 400 }
            );
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            {
                $set: {
                    patientName,
                    phoneNumber,
                    email,
                    age,
                    sex,
                    location,
                    illness,
                },
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedPatient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Profile updated successfully', patient: updatedPatient },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}