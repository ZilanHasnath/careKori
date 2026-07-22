'use client';

import { useState, useEffect } from 'react';

interface Patient {
    _id: string;
    name?: string;
    phoneNumber?: string;
    location?: string;
    email?: string;
}

interface Job {
    _id: string;
    patientId: Patient;
    status: 'Active' | 'pending' | 'Rejected' | 'Finish';
    dateTime: string;
    createdAt: string;
}

export default function CaregiverJobRequestsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchJobs = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setLoading(false);
                return;
            }

            const user = JSON.parse(storedUser);
            const caregiverId = user._id || user.id;

            const res = await fetch(`/api/caregiver/myjobs?caregiverId=${caregiverId}`);
            const data = await res.json();

            if (res.ok && data.jobs) {
                setJobs(data.jobs);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleAccept = async (jobId: string) => {
        setUpdatingId(jobId);
        try {
            const res = await fetch('/api/caregiver/jobs/accept', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId }),
            });

            if (res.ok) {
                setJobs((prev) =>
                    prev.map((job) =>
                        job._id === jobId ? { ...job, status: 'Active' } : job
                    )
                );
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to accept job');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading job requests...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Job Requests</h1>
            {jobs.length === 0 ? (
                <p className="text-gray-500">No job requests found.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white"
                        >
                            <div className="space-y-1">
                                <p className="font-semibold text-lg">
                                    Patient: {job.patientId?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Phone: {job.patientId?.phoneNumber || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Location: {job.patientId?.location || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Date: {new Date(job.dateTime).toLocaleString()}
                                </p>
                                <div className="pt-1">
                                    <span
                                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${job.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : job.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {job.status === 'pending' && (
                                    <button
                                        onClick={() => handleAccept(job._id)}
                                        disabled={updatingId === job._id}
                                        className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                                    >
                                        {updatingId === job._id ? 'Accepting...' : 'Accept Job'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}