'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ICaregiverSummary {
    _id: string;
    name: string;
    phoneNumber: string;
    email?: string;
    location: string;
    expectedSalary: number;
    experience: string;
    sex: string;
    age: number;
    nationalIdPassportNo: string;
    accountType: 'Pending' | 'Approved';
}

export default function CaregiverListPage() {
    const [caregivers, setCaregivers] = useState<ICaregiverSummary[]>([]);
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved'>('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCaregivers();
    }, [filter]);

    async function fetchCaregivers() {
        setLoading(true);
        try {
            const url = filter === 'All' ? '/api/admin/caregiver' : `/api/admin/caregiver?accountType=${filter}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok && data.success) {
                setCaregivers(data.data);
            } else {
                setError(data.error || 'Failed to load caregivers');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(id: string) {
        try {
            const res = await fetch(`/api/admin/caregiver/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType: 'Approved' }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (filter === 'Pending') {
                    setCaregivers((prev) => prev.filter((c) => c._id !== id));
                } else {
                    setCaregivers((prev) =>
                        prev.map((c) => (c._id === id ? { ...c, accountType: 'Approved' } : c))
                    );
                }
            } else {
                alert(data.error || 'Failed to approve caregiver');
            }
        } catch (err) {
            alert('Failed to approve caregiver');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this caregiver?')) return;

        try {
            const res = await fetch(`/api/admin/caregiver/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                setCaregivers((prev) => prev.filter((c) => c._id !== id));
            } else {
                alert(data.error || 'Failed to delete caregiver');
            }
        } catch (err) {
            alert('Failed to delete caregiver');
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Caregivers Management</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage caregiver applications, approvals, and accounts.</p>
                </div>

                <div className="flex w-full sm:w-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(['All', 'Pending', 'Approved'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${filter === tab
                                    ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading caregivers...
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                    {error}
                </div>
            ) : (
                <>
                    <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">NID / Passport</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Expected Salary</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {caregivers.map((caregiver) => (
                                        <tr key={caregiver._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4 font-semibold text-slate-900">{caregiver.name}</td>
                                            <td className="p-4 text-slate-600">{caregiver.phoneNumber}</td>
                                            <td className="p-4 font-mono text-slate-600 text-xs">{caregiver.nationalIdPassportNo}</td>
                                            <td className="p-4 text-slate-600">{caregiver.location}</td>
                                            <td className="p-4 font-medium text-slate-900">${caregiver.expectedSalary}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-semibold ${caregiver.accountType === 'Approved'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}
                                                >
                                                    {caregiver.accountType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-3">
                                                {caregiver.accountType === 'Pending' && (
                                                    <button
                                                        onClick={() => handleApprove(caregiver._id)}
                                                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/caregiver/${caregiver._id}`}
                                                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs transition-colors"
                                                >
                                                    View / Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(caregiver._id)}
                                                    className="text-rose-600 hover:text-rose-700 font-semibold text-xs transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {caregivers.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                                                No caregivers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:hidden space-y-4">
                        {caregivers.map((caregiver) => (
                            <div key={caregiver._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">{caregiver.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{caregiver.phoneNumber}</p>
                                    </div>
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${caregiver.accountType === 'Approved'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}
                                    >
                                        {caregiver.accountType}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 block font-medium">NID / Passport</span>
                                        <span className="font-mono text-slate-700 font-medium">{caregiver.nationalIdPassportNo}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block font-medium">Location</span>
                                        <span className="text-slate-700 font-medium">{caregiver.location}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block font-medium">Salary</span>
                                        <span className="text-slate-900 font-semibold">${caregiver.expectedSalary}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs font-semibold">
                                    {caregiver.accountType === 'Pending' && (
                                        <button
                                            onClick={() => handleApprove(caregiver._id)}
                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <Link
                                        href={`/admin/caregiver/${caregiver._id}`}
                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        View / Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(caregiver._id)}
                                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {caregivers.length === 0 && (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs text-slate-500 font-medium text-sm">
                                No caregivers found.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}