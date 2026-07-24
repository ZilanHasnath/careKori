'use client';

import { useState } from 'react';

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            try {
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            } catch (e) {
                console.warn('Could not clear localStorage:', e);
            }

            window.location.href = '/auth/login';
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 active:bg-red-100 rounded-xl transition-all duration-150 group min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? (
                <svg className="w-5 h-5 animate-spin text-slate-400 group-hover:text-red-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            )}
            <span className="truncate">{loading ? 'Logging out...' : 'Sign Out'}</span>
        </button>
    );
}