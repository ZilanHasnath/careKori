import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Family Member ID is required' },
                { status: 400 }
            );
        }

        const member = await FamilyMember.findById(id).select('-password');

        if (!member) {
            return NextResponse.json(
                { error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, profile: member }, { status: 200 });
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
        const { id, name, phoneNumber, email, relationToPatient } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Family Member ID is required' },
                { status: 400 }
            );
        }

        const updatedMember = await FamilyMember.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    phoneNumber,
                    email,
                    relationToPatient,
                },
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedMember) {
            return NextResponse.json(
                { error: 'Family member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Profile updated successfully', profile: updatedMember },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}