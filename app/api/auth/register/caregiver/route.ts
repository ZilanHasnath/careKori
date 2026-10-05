import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

const BD_PHONE_REGEX = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

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

        const trimmedDocNo = nationalIdPassportNo.toString().trim();

        const conflictQuery: any[] = [
            { phoneNumber: trimmedPhone },
            { nationalIdPassportNo: trimmedDocNo },
        ];

        if (trimmedEmail) {
            conflictQuery.push({ email: trimmedEmail });
        }

        const existingCaregiver = await Caregiver.findOne({ $or: conflictQuery });

        if (existingCaregiver) {
            let conflictField = 'record';
            if (existingCaregiver.phoneNumber === trimmedPhone) {
                conflictField = 'phone number';
            } else if (existingCaregiver.nationalIdPassportNo === trimmedDocNo) {
                conflictField = 'identification document';
            } else if (existingCaregiver.email === trimmedEmail) {
                conflictField = 'email';
            }

            return NextResponse.json(
                { error: `Caregiver with this ${conflictField} already exists` },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newCaregiver = await Caregiver.create({
            name,
            phoneNumber: trimmedPhone,
            email: trimmedEmail,
            location,
            expectedSalary,
            speciality,
            experience,
            sex,
            age,
            nationalIdPassportNo: trimmedDocNo,
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