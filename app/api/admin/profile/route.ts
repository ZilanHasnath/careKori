import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/lib/models/Admin';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const email = request.headers.get('x-admin-email');

        if (!email) {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({ email }).select('-password');

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(admin, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}