import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';

export async function GET() {
    try {
        await dbConnect();

        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: admins }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch admins' },
            { status: 500 }
        );
    }
}