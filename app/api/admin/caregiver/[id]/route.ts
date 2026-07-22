import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await dbConnect();
        const { id } = await params;

        const caregiver = await Caregiver.findById(id).select('-password');

        if (!caregiver) {
            return NextResponse.json({ success: false, error: 'Caregiver not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: caregiver }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch caregiver' }, { status: 500 });
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

        const updatedCaregiver = await Caregiver.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedCaregiver) {
            return NextResponse.json({ success: false, error: 'Caregiver not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedCaregiver }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update caregiver' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedCaregiver = await Caregiver.findByIdAndDelete(id);

        if (!deletedCaregiver) {
            return NextResponse.json({ success: false, error: 'Caregiver not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Caregiver deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete caregiver' }, { status: 500 });
    }
}