'use client';

import { useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

export default function FamilyDashboard({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen w-full bg-slate-50/50 flex flex-col md:flex-row overflow-hidden">
            <header className="md:hidden flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 sticky top-0 z-30 w-full shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                        FP
                    </div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base truncate">Patient Portal</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2.5 -mr-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Toggle Navigation"
                >
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </header>

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside 
                className={`
                    fixed md:relative top-0 left-0 z-50 md:z-auto
                    h-[100dvh] md:h-full w-72 sm:w-80 md:w-64 max-w-[85vw] bg-white border-r border-slate-200/80 
                    flex flex-col justify-between p-5 sm:p-6 
                    transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200 shrink-0">
                                FP
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-slate-900 text-base leading-tight truncate">Patient Portal</h2>
                                <p className="text-xs text-slate-400 font-medium truncate">Family Access</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Close menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-1.5 pt-2 md:pt-0">
                        <Link
                            href="/familymember/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all duration-150 group min-h-[44px]"
                        >
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="truncate">Profile</span>
                        </Link>
                        
                        <Link
                            href="/familymember/mypatient"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all duration-150 group min-h-[44px]"
                        >
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="truncate">My Patient</span>
                        </Link>
                    </nav>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                    <LogoutButton />
                </div>
            </aside>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto h-full">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}