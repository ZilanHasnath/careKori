import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';

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

        const uniqueId = `PAT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        const existingPatient = await Patient.findOne({
            $or: [{ uniqueId }, { phoneNumber }],
        });

        if (existingPatient) {
            return NextResponse.json(
                { error: 'Patient with this Phone Number already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newPatient = await Patient.create({
            uniqueId,
            patientName,
            phoneNumber,
            email,
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