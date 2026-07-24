'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import {
    User,
    Briefcase,
    Activity
} from 'lucide-react';

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Profile', href: '/caregiver/profile', icon: User },
        { name: 'My Job Requests', href: '/caregiver/myjobs/request', icon: Briefcase },
        { name: 'Patient Progress', href: '/caregiver/addprogress', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20 lg:pb-0">
            <div className="flex-1 flex relative items-start">
                <aside className="hidden lg:flex sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-5 flex-col justify-between">
                    <div className="space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="font-bold text-slate-900 text-base leading-tight">Caregiver Portal</h2>
                            <span className="text-[11px] text-slate-400 font-medium">Dashboard</span>
                        </div>

                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                        }`}
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

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 shadow-lg">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
                                    isActive ? 'text-pink-600' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-pink-600' : 'text-slate-500'}`} />
                                <span className="text-[10px] font-medium text-center line-clamp-1">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}