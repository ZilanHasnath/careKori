import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';

const BD_PHONE_REGEX = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const {
            patientName,
            phoneNumber,
            email,
            password,
            age,
            sex,
            location,
            illness,
        } = body;

        if (!patientName || !phoneNumber || !password || !age || !sex || !location) {
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

        const existingPatient = await Patient.findOne({ $or: conflictQuery });

        if (existingPatient) {
            const conflictField = existingPatient.phoneNumber === trimmedPhone ? 'Phone Number' : 'Email';
            return NextResponse.json(
                { error: `Patient with this ${conflictField} already exists` },
                { status: 409 }
            );
        }

        const uniqueId = `PAT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newPatient = await Patient.create({
            uniqueId,
            patientName,
            phoneNumber: trimmedPhone,
            email: trimmedEmail,
            password: hashedPassword,
            age,
            sex,
            location,
            illness: illness || [],
            linkedFamilyMembers: [],
        });

        const patientResponse = newPatient.toObject();
        delete patientResponse.password;

        return NextResponse.json(
            { message: 'Patient registered successfully', patient: patientResponse },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}