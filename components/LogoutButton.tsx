'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

            router.push('/auth/login');
            router.refresh();
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="p-2 text-white bg-amber-950 hover:bg-red-500 rounded text-left font-medium w-full transition disabled:opacity-50"
        >
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
}