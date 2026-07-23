'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    MapPin,
    User,
    Stethoscope,
    Briefcase,
    DollarSign,
    Loader2,
    Calendar,
    ArrowRight,
    Users
} from 'lucide-react';

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
        <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold uppercase tracking-wider">
                    <Users className="h-3.5 w-3.5 text-amber-600" />
                    Caregiver Network
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Search Caregivers</h1>
                <p className="text-sm text-slate-600">Find caregivers by selecting location, gender, or specialty area.</p>
            </div>

            <form onSubmit={fetchCaregivers} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">All Locations</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <User className="h-4 w-4" />
                    </div>
                    <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">All Sex / Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Stethoscope className="h-4 w-4" />
                    </div>
                    <select
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    >
                        <option value="">All Specialties</option>
                        {specialityOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4" />
                            <span>Search</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-3" />
                    <p className="text-sm font-medium text-slate-600">Searching for caregivers...</p>
                </div>
            ) : caregivers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                    <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 mb-1">No caregivers found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your location, gender, or specialty filters to see more results.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {caregivers.map((cg) => (
                        <div key={cg._id} className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                                    <div>
                                        <h2 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">{cg.name}</h2>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                            <span>{cg.location}</span>
                                        </div>
                                    </div>
                                    {typeof cg.matchPercentage === 'number' && (
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                            cg.matchPercentage === 100
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : cg.matchPercentage >= 60
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                            {cg.matchPercentage}% Match
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 mb-6">
                                    <div className="flex items-center gap-2.5">
                                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span><strong className="font-semibold text-slate-800">Gender & Age:</strong> {cg.sex}, {cg.age} yrs</span>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <Stethoscope className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span><strong className="font-semibold text-slate-800">Specialty:</strong> {cg.speciality?.join(', ') || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span><strong className="font-semibold text-slate-800">Experience:</strong> {cg.experience}</span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                                        <span><strong className="font-semibold text-slate-800">Expected Salary:</strong> {cg.expectedSalary} BDT</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/patient/caregiver/${cg._id}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2.5 px-4 transition-all active:scale-[0.98]"
                            >
                                <span>View Full Profile</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}