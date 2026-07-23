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
    Loader2
} from 'lucide-react';

export default function PatientDashboard() {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    const quickActions = [
        {
            title: 'Find Caregiver',
            description: 'Search & hire certified caregivers nearby.',
            href: '/patient/searchCaregiver',
            icon: Search,
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        },
        {
            title: 'Job Requests',
            description: 'Track active & pending care requests.',
            href: '/patient/myrequests',
            icon: Clock,
            color: 'bg-amber-50 text-amber-600 border-amber-100',
        },
        {
            title: 'Health Progress',
            description: 'View daily vitals & caregiver reports.',
            href: '/patient/myprogress',
            icon: TrendingUp,
            color: 'bg-rose-50 text-rose-600 border-rose-100',
        },
        {
            title: 'Family Members',
            description: 'Manage linked family accounts.',
            href: '/patient/familymember',
            icon: Users,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        },
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-xl font-semibold tracking-wider text-indigo-200">
                        Patient Unique Id
                        <br />
                        (Use This To Connect Family Member)
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-1 text-white">
                        {loading ? (
                            <span className="inline-flex items-center gap-2 text-2xl font-medium text-indigo-200">
                                <Loader2 className="w-6 h-6 animate-spin" /> Loading ID...
                            </span>
                        ) : (
                            patient?.uniqueId || patient?._id || 'N/A'
                        )}
                    </h1>
                </div>
                {patient?.patientName && (
                    <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-indigo-500/50 pt-3 sm:pt-0 sm:pl-6">
                        <p className="text-xs text-indigo-200">Logged in as</p>
                        <p className="text-lg font-bold text-white">{patient.patientName}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group bg-white border border-slate-200/80 hover:border-indigo-300 p-4 rounded-xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-2.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${action.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                                        {action.title}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {action.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                                <span>Open</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-900">Profile Completeness</h3>
                        <p className="text-xs text-slate-500">Keep medical history and contacts up to date.</p>
                    </div>
                </div>
                <Link
                    href="/patient/profile"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                    <User className="w-3.5 h-3.5" />
                    <span>Update Profile</span>
                </Link>
            </div>
        </div>
    );
}