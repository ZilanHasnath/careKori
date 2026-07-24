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

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto flex justify-center items-center py-16 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading patients...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Patient List</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage registered patient records and medical details.</p>
            </div>

            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                                <th className="p-4">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Age / Sex</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Illnesses</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((patient) => (
                                <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-4 font-mono text-xs font-semibold text-slate-600">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                            {patient.uniqueId}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-900">{patient.patientName}</td>
                                    <td className="p-4 text-slate-600">{patient.phoneNumber}</td>
                                    <td className="p-4 text-slate-600">{patient.age} / {patient.sex}</td>
                                    <td className="p-4 text-slate-600">{patient.location}</td>
                                    <td className="p-4">
                                        {patient.illness && patient.illness.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {patient.illness.map((ill, idx) => (
                                                    <span key={idx} className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                                                        {ill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">None</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-3">
                                        <Link
                                            href={`/admin/patient/${patient._id}`}
                                            className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs transition-colors"
                                        >
                                            View / Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(patient._id)}
                                            className="text-rose-600 hover:text-rose-700 font-semibold text-xs transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {patients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                                        No patients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:hidden space-y-4">
                {patients.map((patient) => (
                    <div key={patient._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">{patient.patientName}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{patient.phoneNumber}</p>
                            </div>
                            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                ID: {patient.uniqueId}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-slate-400 block font-medium">Age / Sex</span>
                                <span className="text-slate-700 font-medium">{patient.age} / {patient.sex}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Location</span>
                                <span className="text-slate-700 font-medium">{patient.location}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-slate-400 block font-medium mb-1">Illnesses</span>
                                {patient.illness && patient.illness.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {patient.illness.map((ill, idx) => (
                                            <span key={idx} className="inline-flex items-center text-xs px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                                                {ill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-slate-400 italic text-xs">None</span>
                                )}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs font-semibold">
                            <Link
                                href={`/admin/patient/${patient._id}`}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                View / Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(patient._id)}
                                className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {patients.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs text-slate-500 font-medium text-sm">
                        No patients found.
                    </div>
                )}
            </div>
        </div>
    );
}