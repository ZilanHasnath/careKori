'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PatientSummary {
    _id: string;
    uniqueId: string;
    patientName: string;
    phoneNumber: string;
    age: number;
    sex: string;
    location: string;
    illness: string[];
}

export default function PatientListPage() {
    const [patients, setPatients] = useState<PatientSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients() {
        try {
            const res = await fetch('/api/admin/patient');
            const data = await res.json();

            if (res.ok && data.success) {
                setPatients(data.data);
            } else {
                setError(data.error || 'Failed to load patients');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this patient?')) return;

        try {
            const res = await fetch(`/api/admin/patient/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                setPatients((prev) => prev.filter((p) => p._id !== id));
            } else {
                alert(data.error || 'Failed to delete patient');
            }
        } catch (err) {
            alert('Failed to delete patient');
        }
    }

    if (loading) return <div className="p-6">Loading patients...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Patient List</h1>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Age/Sex</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Illnesses</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono">{patient.uniqueId}</td>
                                <td className="p-3 font-medium">{patient.patientName}</td>
                                <td className="p-3">{patient.phoneNumber}</td>
                                <td className="p-3">{patient.age} / {patient.sex}</td>
                                <td className="p-3">{patient.location}</td>
                                <td className="p-3">{patient.illness.join(', ') || 'N/A'}</td>
                                <td className="p-3 text-right space-x-3">
                                    <Link
                                        href={`/admin/patient/${patient._id}`}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        View / Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(patient._id)}
                                        className="text-red-600 hover:underline font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No patients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}