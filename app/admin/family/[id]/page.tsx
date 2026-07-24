'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
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

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading family member details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-medium">
                {error}
            </div>
        );
    }

    if (!member) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium text-sm">
                Family member not found.
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header & Back Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                    href="/admin/family"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Family Members
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                        Edit Member
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                        Delete Member
                    </button>
                </div>
            </div>

            {/* Profile Detail Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100">
                <div className="p-6 bg-slate-50/50">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{member.familyMemberName}</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Family Member Account</p>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                        <span className="text-xs font-medium text-slate-400 block mb-1">Phone Number</span>
                        <p className="font-semibold text-slate-800">{member.phoneNumber}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400 block mb-1">Email Address</span>
                        <p className="font-semibold text-slate-800">{member.email || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400 block mb-1">Location</span>
                        <p className="font-semibold text-slate-800">{member.location}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400 block mb-1">Account Created</span>
                        <p className="font-semibold text-slate-800">
                            {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Linked Patients Section */}
                <div className="p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Linked Patients</h2>
                    {member.linkedPatient && member.linkedPatient.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {member.linkedPatient.map((patient) => (
                                <div key={patient._id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-900 text-sm">{patient.patientName}</span>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-600 font-medium">
                                            ID: {patient.uniqueId}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        <p><span className="text-slate-400 font-medium">Phone:</span> {patient.phoneNumber}</p>
                                        <p><span className="text-slate-400 font-medium">Location:</span> {patient.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No linked patients found.</p>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-bold text-slate-900">Edit Family Member</h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.familyMemberName}
                                    onChange={(e) => setFormData({ ...formData, familyMemberName: e.target.value })}
                                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full text-sm border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}