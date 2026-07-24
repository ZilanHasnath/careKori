'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, HeartHandshake } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function FamilyDashboard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Profile', href: '/familymember/profile', icon: User },
        { name: 'My Patient', href: '/familymember/mypatient', icon: HeartHandshake },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
            <div className="flex-1 flex relative items-start">
                <aside className="hidden md:flex sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200/80 p-5 flex-col justify-between shrink-0">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-1 border-b border-slate-100 pb-4">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                                FP
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-slate-900 text-base leading-tight truncate">Patient Portal</h2>
                                <p className="text-xs text-slate-400 font-medium truncate">Family Access</p>
                            </div>
                        </div>

                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <LogoutButton />
                    </div>
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0">
                    {children}
                </main>
            </div>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 shadow-lg">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 min-w-[64px] py-1 transition-all ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'} transition-transform`} />
                                <span className="text-[11px] font-semibold tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}