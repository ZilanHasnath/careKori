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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            case 'Finish':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
            case 'Rejected':
                return 'bg-rose-50 text-rose-700 border-rose-200/60';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Jobs Management</h1>
                    <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                        Monitor, reassign, and track status for patient service appointments.
                    </p>
                </div>

                <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
                    <div className="inline-flex min-w-full sm:min-w-0 bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1">
                        {(['running', 'Active', 'pending', 'Finish', 'Rejected', 'All'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                                    filter === tab
                                        ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/50'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="w-full flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading jobs...
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-medium">
                    {error}
                </div>
            ) : (
                <>
                    <div className="block md:hidden space-y-3">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Patient</p>
                                        {job.patientId ? (
                                            <>
                                                <p className="font-semibold text-slate-900 text-sm">{job.patientId.patientName}</p>
                                                <p className="text-[11px] text-slate-400 font-mono">ID: {job.patientId.uniqueId}</p>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">Unassigned</span>
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-md font-semibold border shrink-0 ${getStatusBadge(
                                            job.status
                                        )}`}
                                    >
                                        {job.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-slate-400 font-medium">Caregiver</p>
                                        {job.caregiverId ? (
                                            <>
                                                <p className="font-semibold text-slate-800">{job.caregiverId.name}</p>
                                                <p className="text-[11px] text-slate-400">{job.caregiverId.phoneNumber}</p>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-medium">Date & Time</p>
                                        <p className="font-medium text-slate-700">
                                            {new Date(job.dateTime).toLocaleString(undefined, {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                    <select
                                        value={job.status}
                                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Finish">Finish</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/admin/job/${job._id}`}
                                            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium text-xs">
                                No jobs found matching the selected filter.
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Patient</th>
                                        <th className="py-3.5 px-4">Caregiver</th>
                                        <th className="py-3.5 px-4">Date & Time</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {jobs.map((job) => (
                                        <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-medium text-slate-900">
                                                {job.patientId ? (
                                                    <div className="space-y-0.5">
                                                        <p className="font-semibold text-slate-900">{job.patientId.patientName}</p>
                                                        <p className="text-[11px] text-slate-400 font-mono">ID: {job.patientId.uniqueId}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {job.caregiverId ? (
                                                    <div className="space-y-0.5">
                                                        <p className="font-semibold text-slate-800">{job.caregiverId.name}</p>
                                                        <p className="text-[11px] text-slate-400">{job.caregiverId.phoneNumber}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                                                {new Date(job.dateTime).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-md font-semibold border ${getStatusBadge(
                                                        job.status
                                                    )}`}
                                                >
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="inline-flex items-center justify-end gap-2">
                                                    <select
                                                        value={job.status}
                                                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                                                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Finish">Finish</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                    <Link
                                                        href={`/admin/job/${job._id}`}
                                                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        Details
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {jobs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-xs">
                                                No jobs found matching the selected filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}