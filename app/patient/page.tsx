import Link from 'next/link';
import {
    Search,
    Clock,
    TrendingUp,
    Users,
    User,
    ArrowRight,
    ShieldCheck,
    Heart
} from 'lucide-react';

export default function PatientDashboard() {
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