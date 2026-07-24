'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const rawUser = localStorage.getItem('user');
            const storedRole = localStorage.getItem('role');

            if (rawUser && storedRole) {
                setIsLoggedIn(true);
                setRole(storedRole);
            }
        } catch (e) {
            console.error('Failed to parse user data from localStorage', e);
        }
    }, []);

    const getProfilePath = (roleName: string | null) => {
        switch (roleName) {
            case 'patient':
                return '/patient/profile';
            case 'caregiver':
                return '/caregiver/profile';
            case 'family':
                return '/familymember/profile';
            case 'admin':
            case 'superadmin':
                return '/admin/profile';
            default:
                return '/';
        }
    };

    const profileLink = getProfilePath(role);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-1 text-2xl font-black tracking-tight text-slate-900 hover:opacity-90 transition-opacity"
                >
                    careKori<span className="text-blue-600">.</span>
                </Link>

                <div className="flex items-center gap-3">
                    {mounted && isLoggedIn ? (
                        <Link
                            href={profileLink}
                            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-all border border-slate-200/60 shadow-2xs active:scale-95"
                        >
                            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                <User className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <span>My Profile</span>
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center justify-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-blue-500/20 transition-all active:scale-95"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}