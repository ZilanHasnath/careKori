'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Caregiver {
    _id: string;
    name: string;
    phoneNumber: string;
    email?: string;
    location: string;
    expectedSalary: number;
    experience: string;
    sex: 'Male' | 'Female' | 'Other';
    age: number;
    nationalIdPassportNo: string;
    speciality: string[];
    accountType: 'Pending' | 'Approved';
    matchPercentage?: number;
    createdAt: string;
    updatedAt: string;
}

export default function SearchCaregiverPage() {
    const [location, setLocation] = useState('');
    const [sex, setSex] = useState('');
    const [speciality, setSpeciality] = useState('');

    const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cities = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Mymensingh', 'Rangpur', 'Cumilla', 'Barishal', 'Narayanganj', 'Gazipur'];
    const specialityOptions = ['General Care', 'Old-age Care', 'Paralysis', 'Accident Patient', 'Other'];

    const fetchCaregivers = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (location) params.append('location', location);
            if (sex) params.append('sex', sex);
            if (speciality) params.append('speciality', speciality);

            const res = await fetch(`/api/patient/SearchCaregiver?${params.toString()}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch caregivers');
            setCaregivers(data.data || []);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching caregivers');
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Search Caregivers</h1>
                <p className="text-sm text-gray-600">Find caregivers by selecting location, gender, or specialty area.</p>
            </div>

            <form onSubmit={fetchCaregivers} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Locations</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Sex / Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Specialties</option>
                    {specialityOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-sm">Loading caregivers...</div>
            ) : caregivers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                    No caregivers found matching your selected criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caregivers.map((cg) => (
                        <div key={cg._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-semibold text-lg text-gray-900">{cg.name}</h2>
                                    {typeof cg.matchPercentage === 'number' && (
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                            cg.matchPercentage === 100
                                                ? 'bg-green-100 text-green-800'
                                                : cg.matchPercentage >= 60
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {cg.matchPercentage}% Match
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                                    <p><span className="font-medium text-gray-800">Gender & Age:</span> {cg.sex}, {cg.age} yrs</p>
                                    <p><span className="font-medium text-gray-800">Location:</span> {cg.location}</p>
                                    <p><span className="font-medium text-gray-800">Specialty:</span> {cg.speciality?.join(', ') || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-800">Experience:</span> {cg.experience}</p>
                                    <p><span className="font-medium text-gray-800">Expected Salary:</span> {cg.expectedSalary} BDT</p>
                                </div>
                            </div>

                            <Link
                                href={`/patient/caregiver/${cg._id}`}
                                className="w-full text-center bg-gray-900 hover:bg-black text-white font-medium text-sm py-2 rounded-lg transition"
                            >
                                View Full Profile
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}