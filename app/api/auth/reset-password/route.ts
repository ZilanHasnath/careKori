import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Caregiver from '@/lib/models/Caregiver';
import FamilyMember from '@/lib/models/FamilyMember';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
        }

        let user: any = await Patient.findOne({
            resetToken: token,
            resetTokenExp: { $gt: new Date() },
        });

        if (!user) {
            user = await Caregiver.findOne({
                resetToken: token,
                resetTokenExp: { $gt: new Date() },
            });
        }

        if (!user) {
            user = await FamilyMember.findOne({
                resetToken: token,
                resetTokenExp: { $gt: new Date() },
            });
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExp = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password successfully reset' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}