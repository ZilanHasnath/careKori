import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Caregiver from '@/lib/models/Caregiver';
import FamilyMember from '@/lib/models/FamilyMember';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        let user: any = await Patient.findOne({ email });

        if (!user) {
            user = await Caregiver.findOne({ email });
        }

        if (!user) {
            user = await FamilyMember.findOne({ email });
        }

        if (!user) {
            return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExp = new Date(Date.now() + 3600000);

        user.resetToken = resetToken;
        user.resetTokenExp = resetTokenExp;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
        });

        return NextResponse.json({ message: 'Password reset email sent.' });
    } catch (error: any) {
        console.error('FORGOT_PASSWORD_ERROR:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}