'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Loader2,
    Calendar,
    MapPin,
    Phone,
    ArrowRight,
    UserX,
    Clock,
    CheckCircle2,
    XCircle,
    CheckCheck,
    FileText
} from 'lucide-react';

interface CaregiverInfo {
    _id: string;
    name: string;
    phoneNumber: string;
    email?: string;
    location: string;
    expectedSalary: number;
    experience: string;
    sex: 'Male' | 'Female' | 'Other';
}

interface JobRequest {
    _id: string;
    patientId: string;
    caregiverId: CaregiverInfo | null;
    status: 'Active' | 'pending' | 'Rejected' | 'Finish';
    dateTime: string;
    createdAt: string;
    updatedAt: string;
}

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<JobRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                const user = JSON.parse(savedUser);
                const patientId = user._id;

                if (!patientId) {
                    throw new Error('Patient ID not found in session');
                }

                const res = await fetch(`/api/patient/myrequests?patientId=${patientId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch request history');

                setRequests(data.requests || []);
            } catch (err: any) {
                setError(err.message || 'An error occurred while loading requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusBadge = (status: JobRequest['status']) => {
        switch (status) {
            case 'Active':
                return {
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                };
            case 'pending':
                return {
                    badge: 'bg-amber-50 text-amber-700 border-amber-200',
                    icon: <Clock className="h-3.5 w-3.5 text-amber-600" />
                };
            case 'Rejected':
                return {
                    badge: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: <XCircle className="h-3.5 w-3.5 text-rose-600" />
                };
            case 'Finish':
                return {
                    badge: 'bg-blue-50 text-blue-700 border-blue-200',
                    icon: <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
                };
            default:
                return {
                    badge: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: <Clock className="h-3.5 w-3.5 text-slate-500" />
                };
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold uppercase tracking-wider">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        Booking History
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Job Requests</h1>
                    <p className="text-sm text-slate-600">Track all your caregiver requests and booking statuses.</p>
                </div>
                <Link
                    href="/patient/searchCaregiver"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm py-2.5 px-4 shadow-md transition-all active:scale-[0.98] self-start sm:self-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span>Find New Caregiver</span>
                </Link>
            </div>

            {error && (
                <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-3" />
                    <p className="text-sm font-medium text-slate-600">Loading your requests...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                    <FileText className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 mb-1">No job requests submitted yet</h3>
                    <p className="text-sm text-slate-500 mb-6">When you request a caregiver, your booking requests will appear here.</p>
                    <Link
                        href="/patient/searchCaregiver"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2.5 px-5 transition-all active:scale-[0.98]"
                    >
                        <span>Browse Caregivers</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const statusDetails = getStatusBadge(req.status);
                        return (
                            <div
                                key={req._id}
                                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                                            {req.caregiverId?.name || 'Caregiver Unavailable'}
                                        </h2>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${statusDetails.badge}`}>
                                            {statusDetails.icon}
                                            <span>{req.status}</span>
                                        </div>
                                    </div>

                                    {req.caregiverId ? (
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                <span>{req.caregiverId.phoneNumber}</span>
                                            </div>
                                            <span className="text-slate-300 hidden sm:inline">&bull;</span>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                <span>{req.caregiverId.location}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                            <UserX className="h-3.5 w-3.5" />
                                            <span>Caregiver profile is no longer available</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-1">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Requested: {new Date(req.dateTime).toLocaleString()}</span>
                                    </div>
                                </div>

                                {req.caregiverId && (
                                    <Link
                                        href={`/patient/caregiver/${req.caregiverId._id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold text-xs sm:text-sm py-2.5 px-4 transition-all active:scale-[0.98] shrink-0 self-start sm:self-auto"
                                    >
                                        <span>View Profile</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}