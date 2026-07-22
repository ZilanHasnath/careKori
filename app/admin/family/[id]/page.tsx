'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface LinkedPatient {
    _id: string;
    patientName: string;
    uniqueId: string;
    phoneNumber: string;
    location: string;
    illness: string[];
}

interface FamilyMemberDetails {
    _id: string;
    familyMemberName: string;
    phoneNumber: string;
    email?: string;
    location: string;
    linkedPatient: LinkedPatient[];
    createdAt: string;
}

export default function FamilyMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [member, setMember] = useState<FamilyMemberDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        familyMemberName: '',
        phoneNumber: '',
        email: '',
        location: '',
    });

    useEffect(() => {
        async function fetchMember() {
            try {
                const res = await fetch(`/api/admin/family/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setMember(data.data);
                    setFormData({
                        familyMemberName: data.data.familyMemberName || '',
                        phoneNumber: data.data.phoneNumber || '',
                        email: data.data.email || '',
                        location: data.data.location || '',
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
            fetchMember();
        }
    }, [id]);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/family/${member?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMember((prev) => (prev ? { ...prev, ...data.data } : null));
                setIsEditing(false);
            } else {
                alert(data.error || 'Failed to update family member');
            }
        } catch (err) {
            alert('Failed to update family member');
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this family member?')) return;

        try {
            const res = await fetch(`/api/admin/family/${member?._id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/family');
            } else {
                alert(data.error || 'Failed to delete family member');
            }
        } catch (err) {
            alert('Failed to delete family member');
        }
    }

    if (loading) return <div className="p-6">Loading details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!member) return <div className="p-6">Family member not found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:underline"
                >
                    &larr; Back to Family Members
                </button>
                <div className="space-x-3">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit Member
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Member
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-4 bg-white">
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold">{member.familyMemberName}</h1>
                    <p className="text-sm text-gray-500">Family Member Account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 text-sm">Phone Number</span>
                        <p className="font-medium">{member.phoneNumber}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Email</span>
                        <p className="font-medium">{member.email || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Location</span>
                        <p className="font-medium">{member.location}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-3">Linked Patients</h2>
                    {member.linkedPatient && member.linkedPatient.length > 0 ? (
                        <div className="space-y-3">
                            {member.linkedPatient.map((patient) => (
                                <div key={patient._id} className="p-4 border rounded-md bg-gray-50 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{patient.patientName}</span>
                                        <span className="text-xs font-mono text-gray-500">ID: {patient.uniqueId}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                                        <p><span className="text-gray-400">Phone:</span> {patient.phoneNumber}</p>
                                        <p><span className="text-gray-400">Location:</span> {patient.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No linked patients found.</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
                        <h2 className="text-xl font-bold">Edit Family Member</h2>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.familyMemberName}
                                    onChange={(e) => setFormData({ ...formData, familyMemberName: e.target.value })}
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
                                <label className="text-xs font-semibold text-gray-600">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border p-2 rounded text-sm mt-1"
                                />
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