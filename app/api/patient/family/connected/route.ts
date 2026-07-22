import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Patient from "@/lib/models/Patient";
import FamilyMember from "@/lib/models/FamilyMember";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");

        if (!patientId) {
            return NextResponse.json(
                { error: "patientId parameter is required" },
                { status: 400 }
            );
        }

        const patient = await Patient.findById(patientId).populate({
            path: "linkedFamilyMembers",
            model: FamilyMember,
            select: "familyMemberName phoneNumber email location createdAt updatedAt",
        });

        if (!patient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { familyMembers: patient.linkedFamilyMembers || [] },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch family members" },
            { status: 500 }
        );
    }
}