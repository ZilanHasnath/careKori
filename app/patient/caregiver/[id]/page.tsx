'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
    accountType: 'Pending' | 'Approved';
}

export default function CaregiverDetailPage() {
    const params = useParams();
    const caregiverId = params?.id as string;

    const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [patientId, setPatientId] = useState<string | null>(null);
    const [dateTime, setDateTime] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [requestFeedback, setRequestFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        // 1. Fetch logged-in user from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed?._id) {
                    setPatientId(parsed._id);
                }
            } catch (err) {
                console.error('Failed to parse user from localStorage');
            }
        }

        // 2. Fetch Caregiver Details
        if (!caregiverId) return;
        const fetchCaregiver = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/patient/CareGiver/${caregiverId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch caregiver details');
                setCaregiver(data.caregiver);
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchCaregiver();
    }, [caregiverId]);

    const handleSendJobRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setRequestFeedback(null);

        if (!patientId) {
            setRequestFeedback({
                type: 'error',
                message: 'Patient identity not found. Please log in again.',
            });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/patient/requestJob', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    caregiverId,
                    dateTime: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit job request');

            setRequestFeedback({
                type: 'success',
                message: data.message || 'Job request submitted successfully!',
            });
        } catch (err: any) {
            setRequestFeedback({
                type: 'error',
                message: err.message || 'Something went wrong while requesting job',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <p className="text-gray-500 text-sm">Loading caregiver profile...</p>
            </main>
        );
    }

    if (error || !caregiver) {
        return (
            <main className="min-h-screen bg-gray-50 p-6 max-w-3xl mx-auto">
                <Link href="/patient/SearchCaregiver" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                    &larr; Back to Search
                </Link>
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-200">
                    {error || 'Caregiver not found'}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 max-w-3xl mx-auto">
            <Link href="/patient/SearchCaregiver" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
                &larr; Back to Search
            </Link>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{caregiver.name}</h1>
                        <p className="text-sm text-gray-500">
                            {caregiver.sex} &bull; {caregiver.age} Years Old
                        </p>
                    </div>
                    <span className="self-start sm:self-auto bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-200">
                        {caregiver.accountType} Account
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone Number</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{caregiver.phoneNumber}</p>
                    </div>
                    {caregiver.email && (
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                            <p className="font-semibold text-gray-900 mt-0.5">{caregiver.email}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{caregiver.location}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Expected Salary</p>
                        <p className="font-semibold text-gray-900 mt-0.5">${caregiver.expectedSalary}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Experience</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{caregiver.experience}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Request Job</h2>
                <p className="text-xs text-gray-500 mb-4">Select a preferred start date and time to submit a booking request.</p>

                <form onSubmit={handleSendJobRequest} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Start Date & Time (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {requestFeedback && (
                        <div
                            className={`text-sm p-3 rounded-lg border ${requestFeedback.type === 'success'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                        >
                            {requestFeedback.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                    >
                        {submitting ? 'Sending Job Request...' : 'Send Job Request'}
                    </button>
                </form>
            </div>
        </main>
    );
}