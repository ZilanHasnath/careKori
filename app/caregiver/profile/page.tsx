'use client';

import { useState, useEffect } from 'react';
import LogoutButton from '@/components/LogoutButton';
import {
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Briefcase,
    UserCheck,
    Calendar,
    Edit2,
    CheckCircle,
    X,
    Loader2,
    ShieldCheck
} from 'lucide-react';

export default function CaregiverProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
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

        fetch(`/api/caregiver/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProfile(data.profile);
                    setFormData(data.profile);
                }
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const res = await fetch('/api/caregiver/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, id }),
        });

        if (res.ok) {
            const data = await res.json();
            setProfile(data.profile);
            setIsEditing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium text-xs">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 font-bold text-xl uppercase">
                                {profile?.name ? profile.name.charAt(0) : <User className="w-6 h-6" />}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{profile?.name || 'Caregiver Profile'}</h1>
                                <span className="text-xs text-indigo-200 flex items-center gap-1 mt-0.5">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Caregiver
                                </span>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Phone"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Location</label>
                                    <input
                                        name="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Location"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Expected Salary</label>
                                    <input
                                        name="expectedSalary"
                                        type="number"
                                        value={formData.expectedSalary || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Salary"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Experience</label>
                                    <input
                                        name="experience"
                                        value={formData.experience || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Experience"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Gender</label>
                                    <select
                                        name="sex"
                                        value={formData.sex || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        value={formData.age || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Age"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 justify-end">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" /> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.phoneNumber || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Location</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.location || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Expected Salary</span>
                                        <span className="text-xs font-bold text-emerald-700">{profile?.expectedSalary || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Experience</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.experience || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Gender</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.sex || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl flex items-center gap-3 sm:col-span-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Age</span>
                                        <span className="text-xs font-bold text-slate-800">{profile?.age ? `${profile.age} years old` : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <LogoutButton />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}