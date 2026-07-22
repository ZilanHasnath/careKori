import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const {
            familyMemberName,
            phoneNumber,
            email,
            password,
            location,
        } = body;

        if (!familyMemberName || !phoneNumber || !password || !location) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingFamilyMember = await FamilyMember.findOne({ phoneNumber });

        if (existingFamilyMember) {
            return NextResponse.json(
                { error: 'Family member with this phone number already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newFamilyMember = await FamilyMember.create({
            familyMemberName,
            phoneNumber,
            email,
            password: hashedPassword,
            location,
            linkedPatient: [],
        });

        const familyMemberResponse = newFamilyMember.toObject();
        delete familyMemberResponse.password;

        return NextResponse.json(
            { message: 'Family member registered successfully', familyMember: familyMemberResponse },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}