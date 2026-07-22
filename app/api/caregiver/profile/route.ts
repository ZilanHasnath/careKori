import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Caregiver ID is required' },
                { status: 400 }
            );
        }

        const caregiver = await Caregiver.findById(id).select('-password');

        if (!caregiver) {
            return NextResponse.json(
                { error: 'Caregiver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, profile: caregiver }, { status: 200 });
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
        const { id, name, phoneNumber, email, location, specialties, hourlyRate, availability } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Caregiver ID is required' },
                { status: 400 }
            );
        }

        const updatedCaregiver = await Caregiver.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    phoneNumber,
                    email,
                    location,
                    specialties,
                    hourlyRate,
                    availability,
                },
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedCaregiver) {
            return NextResponse.json(
                { error: 'Caregiver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Caregiver profile updated successfully', profile: updatedCaregiver },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}