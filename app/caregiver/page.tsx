'use client';

import Link from 'next/link';
import {
    User,
    Briefcase,
    Activity,
    ArrowRight
} from 'lucide-react';

export default function CaregiverDashboard() {
    const cards = [
        {
            title: 'Profile',
            description: 'View and update your caregiver profile details, certifications, and hourly rates.',
            href: '/caregiver/profile',
            icon: User,
            badge: 'Active Profile',
            badgeColor: 'bg-indigo-100 text-indigo-700',
            iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
            accentGlow: 'group-hover:border-indigo-300 group-hover:shadow-indigo-500/5',
            hoverText: 'group-hover:text-indigo-600',
        },
        {
            title: 'My Job Requests',
            description: 'Check incoming care requests, view schedules, and accept new patients.',
            href: '/caregiver/myjobs/request',
            icon: Briefcase,
            badge: 'New Requests',
            badgeColor: 'bg-emerald-100 text-emerald-700',
            iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
            accentGlow: 'group-hover:border-emerald-300 group-hover:shadow-emerald-500/5',
            hoverText: 'group-hover:text-emerald-600',
        },
        {
            title: 'Patient Progress',
            description: 'Log daily observations, track vital signs, and review active patient updates.',
            href: '/caregiver/addprogress',
            icon: Activity,
            badge: 'Daily Log',
            badgeColor: 'bg-amber-100 text-amber-700',
            iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
            accentGlow: 'group-hover:border-amber-300 group-hover:shadow-amber-500/5',
            hoverText: 'group-hover:text-amber-600',
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className={`group relative bg-white border border-slate-200/90 hover:border-transparent rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${card.accentGlow}`}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                                        {card.badge}
                                    </span>
                                </div>

                                <div>
                                    <h2 className={`font-bold text-slate-900 text-lg transition-colors ${card.hoverText}`}>
                                        {card.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>

                            <div className={`pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 transition-colors ${card.hoverText}`}>
                                <span>Open Section</span>
                                <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}