'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface IPatient {
    _id: string;
    patientName: string;
    uniqueId: string;
    phoneNumber: string;
    location: string;
    illness: string[];
    age: number;
    sex: string;
}

interface ICaregiver {
    _id: string;
    name: string;
    phoneNumber: string;
    location: string;
    experience: string;
    nationalIdPassportNo: string;
}

interface IJobDetails {
    _id: string;
    patientId: IPatient | null;
    caregiverId: ICaregiver | null;
    status: 'Active' | 'pending' | 'Rejected' | 'Finish';
    dateTime: string;
    createdAt: string;
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [job, setJob] = useState<IJobDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/admin/job/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setJob(data.data);
                } else {
                    setError(data.error || 'Failed to load details');
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchJob();
        }
    }, [id]);

    async function handleStatusChange(newStatus: string) {
        try {
            const res = await fetch(`/api/admin/job/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setJob((prev) => (prev ? { ...prev, status: data.data.status } : null));
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            alert('Failed to update status');
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const res = await fetch(`/api/admin/job/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/job');
            } else {
                alert(data.error || 'Failed to delete job');
            }
        } catch (err) {
            alert('Failed to delete job');
        }
    }

    if (loading) return <div className="p-6">Loading details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!job) return <div className="p-6">Job not found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:underline"
                >
                    &larr; Back to Jobs
                </button>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Delete Job
                </button>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-6 bg-white">
                <div className="border-b pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Job Overview</h1>
                        <p className="text-sm text-gray-500">
                            Scheduled Date: {new Date(job.dateTime).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="text-sm border rounded p-1.5 font-medium"
                        >
                            <option value="pending">pending</option>
                            <option value="Active">Active</option>
                            <option value="Finish">Finish</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                        <h2 className="font-bold text-gray-900 border-b pb-2">Patient Details</h2>
                        {job.patientId ? (
                            <>
                                <p className="text-sm"><span className="text-gray-500">Name:</span> {job.patientId.patientName}</p>
                                <p className="text-sm"><span className="text-gray-500 font-mono">ID:</span> {job.patientId.uniqueId}</p>
                                <p className="text-sm"><span className="text-gray-500">Phone:</span> {job.patientId.phoneNumber}</p>
                                <p className="text-sm"><span className="text-gray-500">Location:</span> {job.patientId.location}</p>
                                <p className="text-sm"><span className="text-gray-500">Age / Sex:</span> {job.patientId.age} / {job.patientId.sex}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Patient information unavailable.</p>
                        )}
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                        <h2 className="font-bold text-gray-900 border-b pb-2">Caregiver Details</h2>
                        {job.caregiverId ? (
                            <>
                                <p className="text-sm"><span className="text-gray-500">Name:</span> {job.caregiverId.name}</p>
                                <p className="text-sm"><span className="text-gray-500">Phone:</span> {job.caregiverId.phoneNumber}</p>
                                <p className="text-sm"><span className="text-gray-500">Location:</span> {job.caregiverId.location}</p>
                                <p className="text-sm"><span className="text-gray-500">Experience:</span> {job.caregiverId.experience}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Caregiver information unavailable.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}