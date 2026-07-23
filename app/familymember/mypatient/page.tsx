'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Patient {
    _id: string;
    uniqueId?: string;
    patientName?: string;
    phoneNumber?: string;
    location?: string;
    email?: string;
    age?: number;
    sex?: string;
    illness?: string[];
}

export default function FamilyMyPatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [uniqueIdInput, setUniqueIdInput] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchPatients = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setLoading(false);
                return;
            }

            const user = JSON.parse(storedUser);
            const familyMemberId = user._id || user.id;

            const res = await fetch(`/api/family/mypatient?familyMemberId=${familyMemberId}`);
            const data = await res.json();

            if (res.ok && data.patients) {
                setPatients(data.patients);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setMessage({ type: 'error', text: 'User session missing. Please log in again.' });
            return;
        }

        const user = JSON.parse(storedUser);
        const familyMemberId = user._id || user.id;

        if (!uniqueIdInput.trim()) {
            setMessage({ type: 'error', text: 'Please enter a Patient Unique ID.' });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/family/mypatient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    familyMemberId,
                    uniqueId: uniqueIdInput.trim(),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Patient linked successfully!' });
                setUniqueIdInput('');
                fetchPatients();
                setTimeout(() => {
                    setShowAddModal(false);
                    setMessage(null);
                }, 1200);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to add patient' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'A network error occurred' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[65vh] gap-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium text-xs">Loading patient list...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Linked Family Members</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Manage and track health records for your linked patient profile accounts.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setMessage(null);
                        setShowAddModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Link Patient</span>
                </button>
            </div>

            {patients.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white shadow-2xs space-y-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <p className="text-slate-600 font-semibold text-sm">No patient accounts currently linked</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Link a profile using their assigned Patient ID to monitor progress and healthcare updates.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-block pt-2 text-xs text-indigo-600 font-semibold hover:text-indigo-700 hover:underline cursor-pointer"
                    >
                        + Add a patient using their Unique ID (e.g. PAT-XXXXXX)
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <div
                            key={patient._id}
                            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
                                            {patient.patientName ? patient.patientName.charAt(0) : 'P'}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 leading-tight">
                                                {patient.patientName || 'Unnamed Patient'}
                                            </h2>
                                            <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
                                                {patient.uniqueId || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                        Linked
                                    </span>
                                </div>

                                <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span className="text-slate-400">Phone</span>
                                        <span className="font-semibold text-slate-800">{patient.phoneNumber || 'N/A'}</span>
                                    </div>
                                    {(patient.age || patient.sex) && (
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span className="text-slate-400">Age / Sex</span>
                                            <span className="font-medium text-slate-800">
                                                {patient.age ? `${patient.age} yrs` : ''} {patient.sex ? `(${patient.sex})` : ''}
                                            </span>
                                        </div>
                                    )}
                                    {patient.location && (
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span className="text-slate-400">Location</span>
                                            <span className="font-medium text-slate-800">{patient.location}</span>
                                        </div>
                                    )}
                                    {patient.email && (
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span className="text-slate-400">Email</span>
                                            <span className="font-medium text-slate-800 truncate max-w-[150px]">{patient.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <Link
                                    href={`/familymember/mypatient/progress?patientId=${patient._id}`}
                                    className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-100 text-slate-800 group-hover:text-indigo-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>View Patient Progress</span>
                                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h2 className="text-base font-bold text-slate-900">Link Patient Account</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {message && (
                            <div
                                className={`p-3 rounded-xl text-xs font-medium ${message.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Patient Unique ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PAT-8K9L2M1N"
                                    value={uniqueIdInput}
                                    onChange={(e) => setUniqueIdInput(e.target.value)}
                                    className="w-full border border-slate-200 p-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-mono tracking-wide uppercase text-slate-800 transition-all"
                                    required
                                />
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                    Enter the patient&apos;s generated ID (starts with PAT-).
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                                >
                                    {submitting && (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    <span>{submitting ? 'Linking...' : 'Link Patient'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}