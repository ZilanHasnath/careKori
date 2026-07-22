'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Finish':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Job Requests</h1>
                    <p className="text-sm text-gray-600">Track all your caregiver requests and booking statuses.</p>
                </div>
                <Link
                    href="/patient/searchCaregiver"
                    className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
                >
                    + Find New Caregiver
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-500 text-sm">Loading your requests...</div>
            ) : requests.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                    No job requests submitted yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-semibold text-gray-900 text-base">
                                        {req.caregiverId?.name || 'Caregiver Unavailable'}
                                    </h2>
                                    <h1>Job Request Status: </h1>
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase ${getStatusBadge(req.status)}`}>
                                        {req.status}
                                    </span>

                                </div>

                                {req.caregiverId && (
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-800">Phone:</span> {req.caregiverId.phoneNumber} &bull;{' '}
                                        <span className="font-medium text-gray-800">Location:</span> {req.caregiverId.location}
                                    </p>
                                )}

                                <p className="text-gray-500 text-xs mt-1">
                                    Requested Date & Time: {new Date(req.dateTime).toLocaleString()}
                                </p>
                            </div>

                            {req.caregiverId && (
                                <Link
                                    href={`/patient/caregiver/${req.caregiverId._id}`}
                                    className="text-xs text-blue-600 hover:underline font-medium self-start sm:self-auto"
                                >
                                    View Profile &rarr;
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}