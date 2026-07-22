'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const setSafeLocalStorage = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`Could not save ${key} to localStorage:`, e);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                setSafeLocalStorage('user', JSON.stringify(data.user));
                setSafeLocalStorage('role', data.role);


                if (data.role === 'patient') {
                    router.push('/patient/');
                } else if (data.role === 'caregiver') {
                    router.push('/caregiver/');
                } else if (data.role === 'family') {
                    router.push('/familymember/');
                } else if (data.role === 'admin' || data.role === 'superadmin') {
                    router.push('/admin/');
                }
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        placeholder="Phone or Email"
                        className="w-full border p-2 rounded"
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        disabled={loading}
                        className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>

        </div>
    );
}