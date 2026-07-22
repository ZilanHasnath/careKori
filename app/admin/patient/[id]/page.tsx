'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

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
            } finally {
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

    if (loading) return <div className="p-6">Loading patient details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!patient) return <div className="p-6">Patient not found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:underline"
                >
                    &larr; Back to Patients
                </button>
                <div className="space-x-3">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit Patient
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Patient
                    </button>
                </div>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-4 bg-white">
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold">{patient.patientName}</h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {patient.uniqueId}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 text-sm">Phone Number</span>
                        <p className="font-medium">{patient.phoneNumber}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Email</span>
                        <p className="font-medium">{patient.email || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Age / Sex</span>
                        <p className="font-medium">{patient.age} / {patient.sex}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Location</span>
                        <p className="font-medium">{patient.location}</p>
                    </div>
                </div>

                <div>
                    <span className="text-gray-500 text-sm">Illnesses</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {patient.illness && patient.illness.length > 0 ? (
                            patient.illness.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full border"
                                >
                                    {item}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm font-medium">None specified</p>
                        )}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-3">Linked Family Members</h2>
                    {patient.linkedFamilyMembers && patient.linkedFamilyMembers.length > 0 ? (
                        <div className="space-y-3">
                            {patient.linkedFamilyMembers.map((member) => (
                                <div key={member._id} className="p-4 border rounded-md bg-gray-50 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{member.familyMemberName}</span>
                                        <span className="text-xs text-gray-500">{member.phoneNumber}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                                        <p><span className="text-gray-400">Email:</span> {member.email || 'N/A'}</p>
                                        <p><span className="text-gray-400">Location:</span> {member.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No linked family members found.</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
                        <h2 className="text-xl font-bold">Edit Patient Details</h2>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-600">Patient Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
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
                                <label className="text-xs font-semibold text-gray-600">Illnesses (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.illness}
                                    onChange={(e) => setFormData({ ...formData, illness: e.target.value })}
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