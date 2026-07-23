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
    VenusAndMars
} from 'lucide-react';

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
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-3" />
                <p className="text-sm font-medium text-slate-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/60 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 sm:p-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{patient?.patientName || 'Patient Profile'}</h1>
                                {patient?.uniqueId && (
                                    <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold tracking-wide">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        <span>ID: {patient.uniqueId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-amber-700 font-semibold text-sm shadow-md hover:bg-amber-50 transition-all active:scale-[0.98] self-start sm:self-auto"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {isEditing ? (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input
                                    name="patientName"
                                    value={formData.patientName || ''}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        value={formData.age || ''}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Gender</label>
                                    <select
                                        name="sex"
                                        value={formData.sex || ''}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Location</label>
                                <input
                                    name="location"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60"
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
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-all active:scale-[0.98]"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3.5">
                                <Phone className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5">{patient?.phoneNumber || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3.5">
                                <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5 break-all">{patient?.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3.5">
                                <Calendar className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Age</p>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5">{patient?.age ? `${patient.age} years` : 'N/A'}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3.5">
                                <VenusAndMars className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</p>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5">{patient?.sex || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3.5">
                                <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                                    <p className="text-sm font-medium text-slate-900 mt-0.5">{patient?.location || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}