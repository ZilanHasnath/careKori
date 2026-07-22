import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import FamilyMember from '@/lib/models/FamilyMember';
import Caregiver from '@/lib/models/Caregiver';
import Admin from '@/lib/models/Admin';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const query = {
            $or: [{ phoneNumber: identifier }, { email: identifier }],
        };

        let user = null;
        let role = '';

        user = await Patient.findOne(query);
        if (user) {
            role = 'patient';
        }

        if (!user) {
            user = await FamilyMember.findOne(query);
            if (user) {
                role = 'family';
            }
        }

        if (!user) {
            user = await Caregiver.findOne(query);
            if (user) {
                role = 'caregiver';
            }
        }

        if (!user) {
            user = await Admin.findOne({ email: identifier });
            if (user) {
                role = user.role;
            }
        }

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json(
            {
                message: 'Login successful',
                role,
                user: userResponse,
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