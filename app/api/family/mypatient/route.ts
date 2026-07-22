import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';
import Patient from '@/lib/models/Patient';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const familyMemberId = searchParams.get('familyMemberId');

        if (!familyMemberId) {
            return NextResponse.json(
                { error: 'Family member ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const familyMember = await FamilyMember.findById(familyMemberId).populate({
            path: 'linkedPatient',
            model: Patient,
        });

        if (!familyMember) {
            return NextResponse.json(
                { error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, patients: familyMember.linkedPatient },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { familyMemberId, uniqueId } = body;

        if (!familyMemberId || !uniqueId) {
            return NextResponse.json(
                { error: 'Family member ID and Patient Unique ID are required' },
                { status: 400 }
            );
        }

        const formattedUniqueId = uniqueId.trim().toUpperCase();

        await dbConnect();

        const patient = await Patient.findOne({ uniqueId: formattedUniqueId });
        if (!patient) {
            return NextResponse.json(
                { error: 'No patient found with this Unique ID' },
                { status: 404 }
            );
        }

        const familyMember = await FamilyMember.findById(familyMemberId);
        if (!familyMember) {
            return NextResponse.json(
                { error: 'Family member not found' },
                { status: 404 }
            );
        }

        const isAlreadyLinked = familyMember.linkedPatient.some(
            (id) => id.toString() === patient._id.toString()
        );

        if (isAlreadyLinked) {
            return NextResponse.json(
                { error: 'This patient is already linked to your account' },
                { status: 400 }
            );
        }

        familyMember.linkedPatient.push(patient._id);
        await familyMember.save();

        if (Array.isArray(patient.linkedFamilyMembers)) {
            const isFamilyLinked = patient.linkedFamilyMembers.some(
                (id: any) => id.toString() === familyMember._id.toString()
            );
            if (!isFamilyLinked) {
                patient.linkedFamilyMembers.push(familyMember._id);
                await patient.save();
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Patient linked successfully',
                patient,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}