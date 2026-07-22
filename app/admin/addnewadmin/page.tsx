'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddNewAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/addnewadmin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/manage-admins');
            } else {
                setError(data.error || 'Failed to create new admin');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-lg mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Add New Admin</h1>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:underline"
                >
                    &larr; Back
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-600">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border p-2 rounded text-sm mt-1"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Email Address</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border p-2 rounded text-sm mt-1"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full border p-2 rounded text-sm mt-1"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-600">Role</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full border p-2 rounded text-sm mt-1"
                    >
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Admin'}
                </button>
            </form>
        </div>
    );
}