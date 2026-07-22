import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const admin = await Admin.findById(id).select('-password');

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: admin }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch admin' }, { status: 500 });
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

        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            body.password = await bcrypt.hash(body.password, salt);
        } else {
            delete body.password;
        }

        if (body.email) {
            body.email = body.email.toLowerCase();
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedAdmin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedAdmin }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update admin' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Admin deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete admin' }, { status: 500 });
    }
}