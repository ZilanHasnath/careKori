'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

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

    const handleLogout = () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        } catch (e) {
            console.error('Failed to clear localStorage', e);
        }
        setIsLoggedIn(false);
        setRole(null);
        router.push('/auth/login');
    };

    // Helper to get the correct profile path based on the user's role
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
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-1 text-2xl font-black tracking-tight text-slate-900 hover:opacity-85 transition"
                >
                    careKori<span className="text-blue-600">.</span>
                </Link>

                <div className="flex items-center gap-3">
                    {mounted && isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href={profileLink}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-semibold px-4 py-2 rounded-xl transition border border-slate-200/80"
                            >
                                <User className="h-4 w-4 text-blue-600" />
                                <span>My Profile</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                title="Log out"
                                className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200/80 transition"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition active:scale-[0.98]"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}