'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface IPatient {
    _id: string;
    patientName: string;
    uniqueId: string;
    phoneNumber: string;
    location: string;
}

interface ICaregiver {
    _id: string;
    name: string;
    phoneNumber: string;
    location: string;
}

interface IJobSummary {
    _id: string;
    patientId: IPatient | null;
    caregiverId: ICaregiver | null;
    status: 'Active' | 'pending' | 'Rejected' | 'Finish';
    dateTime: string;
    createdAt: string;
}

export default function JobListPage() {
    const [jobs, setJobs] = useState<IJobSummary[]>([]);
    const [filter, setFilter] = useState<'running' | 'Active' | 'pending' | 'Finish' | 'Rejected' | 'All'>('running');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    async function fetchJobs() {
        setLoading(true);
        try {
            const url = filter === 'All' ? '/api/admin/job' : `/api/admin/job?status=${filter}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok && data.success) {
                setJobs(data.data);
            } else {
                setError(data.error || 'Failed to load jobs');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: string, newStatus: string) {
        try {
            const res = await fetch(`/api/admin/job/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                fetchJobs();
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            alert('Failed to update status');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const res = await fetch(`/api/admin/job/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                setJobs((prev) => prev.filter((j) => j._id !== id));
            } else {
                alert(data.error || 'Failed to delete job');
            }
        } catch (err) {
            alert('Failed to delete job');
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Finish':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Jobs Management</h1>
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg border">
                    {(['running', 'Active', 'pending', 'Finish', 'Rejected', 'All'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filter === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-6">Loading jobs...</div>
            ) : error ? (
                <div className="p-6 text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3">Patient</th>
                                <th className="p-3">Caregiver</th>
                                <th className="p-3">Date/Time</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">
                                        {job.patientId ? (
                                            <div>
                                                <p>{job.patientId.patientName}</p>
                                                <p className="text-xs text-gray-500 font-mono">ID: {job.patientId.uniqueId}</p>
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {job.caregiverId ? (
                                            <div>
                                                <p className="font-medium">{job.caregiverId.name}</p>
                                                <p className="text-xs text-gray-500">{job.caregiverId.phoneNumber}</p>
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="p-3">{new Date(job.dateTime).toLocaleString()}</td>
                                    <td className="p-3">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyle(
                                                job.status
                                            )}`}
                                        >
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <select
                                            value={job.status}
                                            onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                            className="text-xs border rounded p-1"
                                        >
                                            <option value="pending">pending</option>
                                            <option value="Active">Active</option>
                                            <option value="Finish">Finish</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <Link
                                            href={`/admin/job/${job._id}`}
                                            className="text-blue-600 hover:underline font-medium text-xs"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="text-red-600 hover:underline font-medium text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No jobs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}