'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Clock,
    TrendingUp,
    Users,
    User,
    ArrowRight,
    ShieldCheck,
    Loader2,
    Copy,
    Check
} from 'lucide-react';

export default function PatientDashboard() {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            fetch(`/api/patient/profile?id=${parsedUser._id}`)
                .then((res) => res.json())
                .then((data) => {
                    setPatient(data.patient);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const quickActions = [
        {
            title: 'Find Caregiver',
            description: 'Search & hire certified caregivers nearby.',
            href: '/patient/searchCaregiver',
            icon: Search,
            bg: 'bg-indigo-50/80 hover:bg-indigo-100/80',
            iconBg: 'bg-indigo-500 text-white',
            accent: 'text-indigo-600',
        },
        {
            title: 'Job Requests',
            description: 'Track active & pending care requests.',
            href: '/patient/myrequests',
            icon: Clock,
            bg: 'bg-amber-50/80 hover:bg-amber-100/80',
            iconBg: 'bg-amber-500 text-white',
            accent: 'text-amber-600',
        },
        {
            title: 'Health Progress',
            description: 'View daily vitals & caregiver reports.',
            href: '/patient/myprogress',
            icon: TrendingUp,
            bg: 'bg-rose-50/80 hover:bg-rose-100/80',
            iconBg: 'bg-rose-500 text-white',
            accent: 'text-rose-600',
        },
        {
            title: 'Family Members',
            description: 'Manage linked family accounts.',
            href: '/patient/familymember',
            icon: Users,
            bg: 'bg-emerald-50/80 hover:bg-emerald-100/80',
            iconBg: 'bg-emerald-500 text-white',
            accent: 'text-emerald-600',
        },
    ];

    const displayId = patient?.uniqueId || patient?._id || '';

    return (
        <div className="space-y-5 sm:space-y-6 max-w-6xl mx-auto px-1 sm:px-0 pb-6">
            <div className="relative overflow-hidden bg-black rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-20 -bottom-10 w-32 h-32 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-pink-100 border border-white/20">
                            <span> Patient Unique ID</span>
                        </div>
                        
                        <div className="flex items-center gap-3 pt-1">
                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
                                {loading ? (
                                    <span className="inline-flex items-center gap-2 text-xl font-medium text-indigo-100">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Fetching ID...
                                    </span>
                                ) : (
                                    displayId || 'N/A'
                                )}
                            </h1>

                            {!loading && displayId && (
                                <button
                                    onClick={() => copyToClipboard(displayId)}
                                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 text-white"
                                    title="Copy ID"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                                </button>
                            )}
                        </div>

                        <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
                            Share this ID to link family member accounts.
                        </p>
                    </div>

                    
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className={`group relative p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 border border-slate-100 ${action.bg} flex flex-col justify-between`}
                        >
                            <div className="space-y-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${action.iconBg}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800 text-base group-hover:text-slate-900 transition-colors">
                                        {action.title}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {action.description}
                                    </p>
                                </div>
                            </div>

                            <div className={`mt-5 flex items-center text-xs font-bold ${action.accent}`}>
                                <span>Explore</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-pink-400 flex items-center justify-center shrink-0 border border-white/10">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Profile Completeness</h3>
                        <p className="text-xs text-slate-300">Keep medical history and contacts updated for better care.</p>
                    </div>
                </div>
                <Link
                    href="/patient/profile"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                >
                    <User className="w-3.5 h-3.5" />
                    <span>Update Profile</span>
                </Link>
            </div>
        </div>
    );
}