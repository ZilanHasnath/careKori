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

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Management</h1>
                <Link
                    href="/admin/addnewadmin"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                    + Add New Admin
                </Link>
            </div>

            {loading ? (
                <div className="p-6">Loading admins...</div>
            ) : error ? (
                <div className="p-6 text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Created Date</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{admin.name}</td>
                                    <td className="p-3">{admin.email}</td>
                                    <td className="p-3">
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => handleDelete(admin._id)}
                                            className="text-red-600 hover:underline font-medium text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No admin accounts found.
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