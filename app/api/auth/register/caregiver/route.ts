import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const {
            name,
            phoneNumber,
            email,
            location,
            expectedSalary,
            speciality,
            experience,
            sex,
            age,
            nationalIdPassportNo,
            password,
        } = body;

        if (!name || !phoneNumber || !location || !expectedSalary || !speciality || !experience || !sex || !age || !nationalIdPassportNo || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingCaregiver = await Caregiver.findOne({
            $or: [{ phoneNumber }, { nationalIdPassportNo }],
        });

        if (existingCaregiver) {
            return NextResponse.json(
                { error: 'Caregiver with this phone number or identification document already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newCaregiver = await Caregiver.create({
            name,
            phoneNumber,
            email,
            location,
            expectedSalary,
            speciality,
            experience,
            sex,
            age,
            nationalIdPassportNo,
            password: hashedPassword,
            accountType: 'Pending',
        });

        const caregiverResponse = newCaregiver.toObject();
        delete caregiverResponse.password;

        return NextResponse.json(
            { message: 'Caregiver registration submitted successfully and is pending approval', caregiver: caregiverResponse },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}