import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Caregiver from '@/lib/models/Caregiver';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const location = searchParams.get('location');
        const sex = searchParams.get('sex');
        const speciality = searchParams.get('speciality');

        if (!location && !sex && !speciality) {
            return NextResponse.json({
                success: true,
                count: 0,
                data: [],
            }, { status: 200 });
        }

        const queryConditions: Record<string, unknown>[] = [{ accountType: 'Approved' }];
        const filterOr: Record<string, unknown>[] = [];

        if (location) filterOr.push({ location });
        if (sex) filterOr.push({ sex });
        if (speciality) {
            filterOr.push({
                speciality: { $regex: new RegExp(`^${speciality}$`, 'i') }
            });
        }

        if (filterOr.length > 0) {
            queryConditions.push({ $or: filterOr });
        }

        const caregivers = await Caregiver.find({ $and: queryConditions })
            .select('-password')
            .lean();

        const scoredCaregivers = caregivers.map((caregiver) => {
            let score = 0;

            const isLocationMatch =
                Boolean(location) &&
                caregiver.location?.toLowerCase() === location?.toLowerCase();

            const isSexMatch =
                Boolean(sex) &&
                caregiver.sex?.toLowerCase() === sex?.toLowerCase();

            const caregiverSpecialities = Array.isArray(caregiver.speciality) ? caregiver.speciality : [];
            const isSpecialityMatch =
                Boolean(speciality) &&
                caregiverSpecialities.some(
                    (s: string) => s?.toLowerCase() === speciality?.toLowerCase()
                );

            if (isLocationMatch) score += 40;
            if (isSpecialityMatch) score += 40;
            if (isSexMatch) score += 20;

            return {
                ...caregiver,
                matchPercentage: score,
            };
        });

        scoredCaregivers.sort((a, b) => b.matchPercentage - a.matchPercentage);

        return NextResponse.json({
            success: true,
            count: scoredCaregivers.length,
            data: scoredCaregivers,
        }, { status: 200 });

    } catch (error) {
        console.error('Search API Error:', error); 
        return NextResponse.json({
            success: false,
            error: 'Failed to search caregivers',
        }, { status: 500 });
    }
}