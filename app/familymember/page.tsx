import Link from 'next/link';
import { User, HeartHandshake, ArrowRight } from 'lucide-react';

export default function FamilyDashboardPage() {
    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                    Quick Access
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Link
                        href="/familymember/profile"
                        className="group flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate">
                                    Profile
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                    Manage your account settings
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>

                    <Link
                        href="/familymember/mypatient"
                        className="group flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate">
                                    My Patient
                                </h3>
                                <p className="text-xs text-slate-500 truncate">
                                    View patient info and status
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}