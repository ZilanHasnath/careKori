'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface ICaregiverDetails {
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
    createdAt: string;
}

export default function CaregiverDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [caregiver, setCaregiver] = useState<ICaregiverDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        location: '',
        expectedSalary: 0,
        experience: '',
        sex: 'Male',
        age: 0,
        nationalIdPassportNo: '',
        accountType: 'Pending',
    });

    useEffect(() => {
        async function fetchCaregiver() {
            try {
                const res = await fetch(`/api/admin/caregiver/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setCaregiver(data.data);
                    setFormData({
                        name: data.data.name || '',
                        phoneNumber: data.data.phoneNumber || '',
                        email: data.data.email || '',
                        location: data.data.location || '',
                        expectedSalary: data.data.expectedSalary || 0,
                        experience: data.data.experience || '',
                        sex: data.data.sex || 'Male',
                        age: data.data.age || 0,
                        nationalIdPassportNo: data.data.nationalIdPassportNo || '',
                        accountType: data.data.accountType || 'Pending',
                    });
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
            fetchCaregiver();
        }
    }, [id]);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/caregiver/${caregiver?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCaregiver((prev) => (prev ? { ...prev, ...data.data } : null));
                setIsEditing(false);
            } else {
                alert(data.error || 'Failed to update caregiver');
            }
        } catch (err) {
            alert('Failed to update caregiver');
        }
    }

    async function handleApprove() {
        try {
            const res = await fetch(`/api/admin/caregiver/${caregiver?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType: 'Approved' }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCaregiver((prev) => (prev ? { ...prev, accountType: 'Approved' } : null));
                setFormData((prev) => ({ ...prev, accountType: 'Approved' }));
            } else {
                alert(data.error || 'Failed to approve caregiver');
            }
        } catch (err) {
            alert('Failed to approve caregiver');
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this caregiver?')) return;

        try {
            const res = await fetch(`/api/admin/caregiver/${caregiver?._id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/caregiver');
            } else {
                alert(data.error || 'Failed to delete caregiver');
            }
        } catch (err) {
            alert('Failed to delete caregiver');
        }
    }

    if (loading) return <div className="p-6">Loading details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!caregiver) return <div className="p-6">Caregiver not found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:underline"
                >
                    &larr; Back to Caregivers
                </button>
                <div className="space-x-3">
                    {caregiver.accountType === 'Pending' && (
                        <button
                            onClick={handleApprove}
                            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Approve Account
                        </button>
                    )}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-4 bg-white">
                <div className="border-b pb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{caregiver.name}</h1>
                        <p className="text-sm text-gray-500 font-mono">NID / Passport: {caregiver.nationalIdPassportNo}</p>
                    </div>
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${caregiver.accountType === 'Approved'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}
                    >
                        {caregiver.accountType}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 text-sm">Phone Number</span>
                        <p className="font-medium">{caregiver.phoneNumber}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Email</span>
                        <p className="font-medium">{caregiver.email || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Age / Sex</span>
                        <p className="font-medium">{caregiver.age} / {caregiver.sex}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Location</span>
                        <p className="font-medium">{caregiver.location}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Expected Salary</span>
                        <p className="font-medium">${caregiver.expectedSalary}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Experience</span>
                        <p className="font-medium">{caregiver.experience}</p>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold">Edit Caregiver</h2>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">NID / Passport No</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nationalIdPassportNo}
                                    onChange={(e) => setFormData({ ...formData, nationalIdPassportNo: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600">Age</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                        className="w-full border p-2 rounded text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600">Sex</label>
                                    <select
                                        value={formData.sex}
                                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                        className="w-full border p-2 rounded text-sm mt-1"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Expected Salary</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.expectedSalary}
                                    onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Experience</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Account Status</label>
                                <select
                                    value={formData.accountType}
                                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'Pending' | 'Approved' })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border text-sm rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}