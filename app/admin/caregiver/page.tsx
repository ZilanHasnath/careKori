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
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Caregivers Management</h1>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg border">
                    {(['All', 'Pending', 'Approved'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${filter === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-6">Loading caregivers...</div>
            ) : error ? (
                <div className="p-6 text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">NID / Passport</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Expected Salary</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caregivers.map((caregiver) => (
                                <tr key={caregiver._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{caregiver.name}</td>
                                    <td className="p-3">{caregiver.phoneNumber}</td>
                                    <td className="p-3 font-mono">{caregiver.nationalIdPassportNo}</td>
                                    <td className="p-3">{caregiver.location}</td>
                                    <td className="p-3">${caregiver.expectedSalary}</td>
                                    <td className="p-3">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${caregiver.accountType === 'Approved'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                }`}
                                        >
                                            {caregiver.accountType}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        {caregiver.accountType === 'Pending' && (
                                            <button
                                                onClick={() => handleApprove(caregiver._id)}
                                                className="text-green-600 hover:underline font-medium"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <Link
                                            href={`/admin/caregiver/${caregiver._id}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            View / Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(caregiver._id)}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {caregivers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No caregivers found.
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