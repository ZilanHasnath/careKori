'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Heart,
    Edit2,
    CheckCircle,
    X,
    Loader2,
    Users
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function FamilyMemberProfile() {
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

        fetch(`/api/family/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProfile(data.profile);
                    setFormData({
                        name: data.profile.familyMemberName,
                        phoneNumber: data.profile.phoneNumber,
                        email: data.profile.email || '',
                        relationToPatient: data.profile.relationToPatient || ''
                    });
                }
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const res = await fetch('/api/family/profile', {
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
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium text-xs">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0 shadow-inner">
                                <User className="w-7 h-7 sm:w-8 sm:h-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">
                                    {profile?.familyMemberName || 'Family Member Profile'}
                                </h1>
                                <span className="text-xs text-blue-100 flex items-center gap-1.5 mt-1 font-medium">
                                    <Users className="w-3.5 h-3.5" /> Linked Family Account
                                </span>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0"
                            >
                                <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Phone"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700">Relation to Patient</label>
                                    <input
                                        name="relationToPatient"
                                        value={formData.relationToPatient || ''}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Relation to Patient"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-slate-100 justify-end">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
                                >
                                    <CheckCircle className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                                    <span className="text-sm font-bold text-slate-800 truncate block">{profile?.phoneNumber || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                                    <span className="text-sm font-bold text-slate-800 truncate block">{profile?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Location</span>
                                    <span className="text-sm font-bold text-slate-800 truncate block">{profile?.location || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Relation to Patient</span>
                                    <span className="text-sm font-bold text-slate-800 truncate block">{profile?.relationToPatient || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
                <div className="w-full">
                    <LogoutButton />
            </div>
        </div>
    );
}