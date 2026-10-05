import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import FamilyMember from '@/lib/models/FamilyMember';

const BD_PHONE_REGEX = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

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

        const trimmedPhone = phoneNumber.toString().trim();
        if (!BD_PHONE_REGEX.test(trimmedPhone)) {
            return NextResponse.json(
                { error: 'Invalid Bangladeshi phone number' },
                { status: 400 }
            );
        }

        const trimmedEmail = email ? email.toString().trim().toLowerCase() : null;
        if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
            return NextResponse.json(
                { error: 'Invalid email address format' },
                { status: 400 }
            );
        }

        const conflictQuery: any[] = [{ phoneNumber: trimmedPhone }];
        if (trimmedEmail) {
            conflictQuery.push({ email: trimmedEmail });
        }

        const existingFamilyMember = await FamilyMember.findOne({ $or: conflictQuery });

        if (existingFamilyMember) {
            const conflictField = existingFamilyMember.phoneNumber === trimmedPhone ? 'phone number' : 'email';
            return NextResponse.json(
                { error: `Family member with this ${conflictField} already exists` },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newFamilyMember = await FamilyMember.create({
            familyMemberName,
            phoneNumber: trimmedPhone,
            email: trimmedEmail,
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