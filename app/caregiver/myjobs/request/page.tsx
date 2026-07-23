'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    CheckCircle2,
    Loader2,
    Clock,
    XCircle,
    Check
} from 'lucide-react';

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
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium text-xs">Loading job requests...</p>
            </div>
        );
    }

    const getStatusBadge = (status: Job['status']) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Requests</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage and accept incoming care requests from patients.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-100">
                    <Briefcase className="w-4 h-4" />
                    <span>{jobs.length} Total Requests</span>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 shadow-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">No Job Requests Found</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        You don&apos;t have any job requests right now. New requests from patients will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row justify-between md:items-center gap-5"
                        >
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-sm">
                                        {job.patientId?.name ? job.patientId.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-slate-900 text-base">
                                                {job.patientId?.name || 'N/A'}
                                            </h2>
                                            {getStatusBadge(job.status)}
                                        </div>
                                        <span className="text-xs text-slate-400">Patient Request</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{job.patientId?.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{job.patientId?.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{new Date(job.dateTime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                {job.status === 'pending' && (
                                    <button
                                        onClick={() => handleAccept(job._id)}
                                        disabled={updatingId === job._id}
                                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {updatingId === job._id ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Accepting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Accept Job</span>
                                            </>
                                        )}
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