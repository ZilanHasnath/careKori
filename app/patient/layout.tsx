'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import {
    User,
    Search,
    Clock,
    TrendingUp,
    Users,
    Menu,
    X
    
} from 'lucide-react';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Profile', href: '/patient/profile', icon: User },
        { name: 'Search Caregiver', href: '/patient/searchCaregiver', icon: Search },
        { name: 'My Job Requests', href: '/patient/myrequests', icon: Clock },
        { name: 'My Progress', href: '/patient/myprogress', icon: TrendingUp },
        { name: 'My Family Member', href: '/patient/familymember', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Patient Portal</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-4 h-4" />
                    <span>Menu</span>
                </button>
            </div>

            <div className="flex-1 flex relative items-start">
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 lg:hidden transition-opacity"
                    />
                )}


                <aside
                    className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            lg:sticky lg:top-16 lg:z-30 lg:w-64 lg:h-[calc(100vh-4rem)] lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div>
                                    <h2 className="font-bold text-slate-900 text-base leading-tight">Patient Portal</h2>
                                    <span className="text-[11px] text-slate-400 font-medium">Dashboard</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                    flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'}
                    `}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <LogoutButton />
                    </div>
                </aside>

                <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}