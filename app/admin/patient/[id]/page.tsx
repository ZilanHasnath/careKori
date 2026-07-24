'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

interface IFamilyMember {
    _id: string;
    familyMemberName: string;
    phoneNumber: string;
    email?: string;
    location: string;
}

interface IPatientDetails {
    _id: string;
    uniqueId: string;
    patientName: string;
    phoneNumber: string;
    email?: string;
    age: number;
    sex: string;
    location: string;
    illness: string[];
    linkedFamilyMembers: IFamilyMember[];
    createdAt: string;
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [patient, setPatient] = useState<IPatientDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        email: '',
        age: 0,
        sex: 'Male',
        location: '',
        illness: '',
    });

    useEffect(() => {
        async function fetchPatient() {
            try {
                const res = await fetch(`/api/admin/patient/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setPatient(data.data);
                    setFormData({
                        patientName: data.data.patientName || '',
                        phoneNumber: data.data.phoneNumber || '',
                        email: data.data.email || '',
                        age: data.data.age || 0,
                        sex: data.data.sex || 'Male',
                        location: data.data.location || '',
                        illness: data.data.illness ? data.data.illness.join(', ') : '',
                    });
                } else {
                    setError(data.error || 'Failed to load details');
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } {
                setLoading(false);
            }
        }

        if (id) {
            fetchPatient();
        }
    }, [id]);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                illness: formData.illness.split(',').map((s) => s.trim()).filter(Boolean),
            };

            const res = await fetch(`/api/admin/patient/${patient?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setPatient((prev) => (prev ? { ...prev, ...data.data } : null));
                setIsEditing(false);
            } else {
                alert(data.error || 'Failed to update patient');
            }
        } catch (err) {
            alert('Failed to update patient');
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this patient?')) return;

        try {
            const res = await fetch(`/api/admin/patient/${patient?._id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/patient');
            } else {
                alert(data.error || 'Failed to delete patient');
            }
        } catch (err) {
            alert('Failed to delete patient');
        }
    }

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading patient details...
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

    if (!patient) {
        return (
            <div className="w-full max-w-4xl mx-auto p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs text-slate-500 font-medium text-sm">
                Patient not found.
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                    href="/admin/patient/"
                    className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
                >
                    &larr; Back to Patients
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-2xs transition-colors"
                    >
                        Edit Patient
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200/60 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                        Delete Patient
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{patient.patientName}</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Registered on {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className="font-mono text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 w-fit">
                        ID: {patient.uniqueId}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                        <span className="text-slate-400 text-xs block font-medium">Phone Number</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{patient.phoneNumber}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs block font-medium">Email Address</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{patient.email || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs block font-medium">Age / Sex</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{patient.age} / {patient.sex}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs block font-medium">Location</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{patient.location}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <span className="text-slate-400 text-xs block font-medium mb-2">Illnesses</span>
                    <div className="flex flex-wrap gap-1.5">
                        {patient.illness && patient.illness.length > 0 ? (
                            patient.illness.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center text-xs px-3 py-1 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200/60"
                                >
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-400 italic text-xs">None specified</span>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Linked Family Members</h2>
                    {patient.linkedFamilyMembers && patient.linkedFamilyMembers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {patient.linkedFamilyMembers.map((member) => (
                                <div key={member._id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-900 text-sm">{member.familyMemberName}</span>
                                        <span className="text-xs font-semibold text-slate-500">{member.phoneNumber}</span>
                                    </div>
                                    <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        <p><span className="text-slate-400 font-medium">Email:</span> {member.email || 'N/A'}</p>
                                        <p><span className="text-slate-400 font-medium">Location:</span> {member.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No linked family members found.</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-5 shadow-xl border border-slate-100">
                        <div className="border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-bold text-slate-900">Edit Patient Details</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Update demographic and medical data.</p>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 block mb-1">Sex</label>
                                    <select
                                        value={formData.sex}
                                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1">Illnesses (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.illness}
                                    onChange={(e) => setFormData({ ...formData, illness: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-2xs transition-colors"
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