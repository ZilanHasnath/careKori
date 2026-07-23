import Link from 'next/link';

export default function FamilyDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Family Dashboard</h1>
                <p className="mt-1 text-sm sm:text-base text-slate-500">Welcome to your dashboard.</p>
            </div>

            <div className="pt-2">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    <Link
                        href="/familymember/profile"
                        className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">Profile</h3>
                            <p className="text-xs text-slate-500 truncate">Manage your account settings</p>
                        </div>
                    </Link>

                    <Link
                        href="/familymember/mypatient"
                        className="flex items-center gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">My Patient</h3>
                            <p className="text-xs text-slate-500 truncate">View patient info and status</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}