'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LinkedPatient {
    _id: string;
    patientName: string;
    uniqueId: string;
}

interface FamilyMemberSummary {
    _id: string;
    familyMemberName: string;
    phoneNumber: string;
    email?: string;
    location: string;
    linkedPatient: LinkedPatient[];
}

export default function FamilyMemberListPage() {
    const [members, setMembers] = useState<FamilyMemberSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    async function fetchFamilyMembers() {
        try {
            const res = await fetch('/api/admin/family');
            const data = await res.json();

            if (res.ok && data.success) {
                setMembers(data.data);
            } else {
                setError(data.error || 'Failed to load family members');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this family member?')) return;

        try {
            const res = await fetch(`/api/admin/family/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                setMembers((prev) => prev.filter((m) => m._id !== id));
            } else {
                alert(data.error || 'Failed to delete family member');
            }
        } catch (err) {
            alert('Failed to delete family member');
        }
    }

    if (loading) return <div className="p-6">Loading family members...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Family Member List</h1>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Linked Patients</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{member.familyMemberName}</td>
                                <td className="p-3">{member.phoneNumber}</td>
                                <td className="p-3">{member.email || 'N/A'}</td>
                                <td className="p-3">{member.location}</td>
                                <td className="p-3">
                                    {member.linkedPatient && member.linkedPatient.length > 0
                                        ? member.linkedPatient.map((p) => p.patientName).join(', ')
                                        : 'None'}
                                </td>
                                <td className="p-3 text-right space-x-3">
                                    <Link
                                        href={`/admin/family/${member._id}`}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        View / Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="text-red-600 hover:underline font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    No family members found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}