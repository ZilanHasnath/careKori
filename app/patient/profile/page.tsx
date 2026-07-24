'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Edit3,
    Save,
    X,
    Loader2,
    ShieldCheck,
    VenusAndMars,
    Activity
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function PatientProfile() {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/patient/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPatient(data.patient);
                setFormData(data.patient);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setSaving(true);
        const res = await fetch('/api/patient/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, id }),
        });

        if (res.ok) {
            const data = await res.json();
            setPatient(data.patient);
            setIsEditing(false);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-medium text-slate-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-32 sm:h-44 bg-slate-900 border-b border-slate-100 relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#linear-gradient,transparent_1px)] [background-size:16px_16px]" />
                </div>

                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center shrink-0 text-slate-600 self-start sm:self-auto">
                                <User className="h-12 w-12 sm:h-16 sm:w-16" />
                            </div>
                            <div className="pt-2 sm:pt-0 sm:mb-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                    {patient?.patientName || 'Patient Profile'}
                                </h1>
                                {patient?.uniqueId && (
                                    <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500">
                                        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                                        <span>ID: {patient.uniqueId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm active:scale-95 w-full sm:w-auto"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    name="patientName"
                                    value={formData.patientName || ''}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Illness / Condition</label>
                                <input
                                    name="illness"
                                    value={formData.illness || ''}
                                    onChange={handleChange}
                                    placeholder="Illness or Medical Condition"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        value={formData.age || ''}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Gender</label>
                                    <select
                                        name="sex"
                                        value={formData.sex || ''}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Location</label>
                                <input
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData(patient);
                                        setIsEditing(false);
                                    }}
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all active:scale-95"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5 md:col-span-2">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Illness / Condition</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient?.illness || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <Phone className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient?.phoneNumber || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <Mail className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{patient?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <Calendar className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Age</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient?.age ? `${patient.age} years` : 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <VenusAndMars className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient?.sex || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-3.5 md:col-span-2">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                                        <MapPin className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient?.location || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <div className="w-full sm:w-auto">
                                    <LogoutButton />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}