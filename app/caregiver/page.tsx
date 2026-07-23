'use client';

import Link from 'next/link';
import { User, Briefcase, Activity, ArrowRight } from 'lucide-react';

export default function CaregiverDashboard() {
    const cards = [
        {
            title: 'Profile',
            description: 'View and update your caregiver profile details and rates.',
            href: '/caregiver/profile',
            icon: User,
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        },
        {
            title: 'My Job Requests',
            description: 'Check incoming care requests and accept new patients.',
            href: '/caregiver/myjobs/request',
            icon: Briefcase,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        },
        {
            title: 'Patient Progress',
            description: 'Log and review daily progress updates for active patients.',
            href: '/caregiver/addprogress',
            icon: Activity,
            color: 'bg-amber-50 text-amber-600 border-amber-100',
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="pb-4 border-b border-slate-200/80">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Caregiver Dashboard</h1>
                <p className="text-xs text-slate-500 mt-0.5">Welcome back! Quick access to your daily portal tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                                        {card.title}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                                <span>Navigate</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}