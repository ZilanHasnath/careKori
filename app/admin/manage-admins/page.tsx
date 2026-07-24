'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface IAdminSummary {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState<IAdminSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    async function fetchAdmins() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/getall');
            const data = await res.json();

            if (res.ok && data.success) {
                setAdmins(data.data);
            } else {
                setError(data.error || 'Failed to fetch admins');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                setAdmins((prev) => prev.filter((a) => a._id !== id));
            } else {
                alert(data.error || 'Failed to delete admin');
            }
        } catch (err) {
            alert('Failed to delete admin');
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SuperAdmin':
                return 'bg-purple-50 text-purple-700 border-purple-200/60';
            case 'Manager':
                return 'bg-amber-50 text-amber-700 border-amber-200/60';
            default:
                return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Management</h1>
                    <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                        View, manage, and provision administrative user accounts.
                    </p>
                </div>
                <Link
                    href="/admin/addnewadmin"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors shrink-0"
                >
                    + Add New Admin
                </Link>
            </div>

            {loading ? (
                <div className="w-full flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading administrators...
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-medium">
                    {error}
                </div>
            ) : (
                <>
                    <div className="block md:hidden space-y-3">
                        {admins.map((admin) => (
                            <div key={admin._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{admin.name}</p>
                                        <p className="text-xs text-slate-500">{admin.email}</p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-md font-semibold border shrink-0 ${getRoleBadge(
                                            admin.role
                                        )}`}
                                    >
                                        {admin.role}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <div>
                                        <span className="text-slate-400">Created: </span>
                                        <span className="font-medium text-slate-600">
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(admin._id)}
                                        className="px-3 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/60 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {admins.length === 0 && (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-medium text-xs">
                                No admin accounts found.
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Name</th>
                                        <th className="py-3.5 px-4">Email</th>
                                        <th className="py-3.5 px-4">Role</th>
                                        <th className="py-3.5 px-4">Created Date</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {admins.map((admin) => (
                                        <tr key={admin._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-slate-900">{admin.name}</td>
                                            <td className="py-3.5 px-4 text-slate-600">{admin.email}</td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-md font-semibold border ${getRoleBadge(
                                                        admin.role
                                                    )}`}
                                                >
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                                {new Date(admin.createdAt).toLocaleDateString(undefined, {
                                                    dateStyle: 'medium',
                                                })}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {admins.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-xs">
                                                No admin accounts found.
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