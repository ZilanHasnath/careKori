'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedRole = localStorage.getItem('role');

                if (!storedUser || !(storedRole === 'admin' || storedRole === 'superadmin')) {
                    router.push('/auth/login');
                    return;
                }

                const userObj = JSON.parse(storedUser);

                const res = await fetch('/api/admin/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-email': userObj.email || '',
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch profile');
                }

                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 font-medium">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <p className="font-semibold">Error loading profile</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Profile</h1>

            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Name</span>
                    <span className="text-gray-900 font-semibold">{profile?.name}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Email Address</span>
                    <span className="text-gray-900">{profile?.email}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Role</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase">
                        {profile?.role}
                    </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500 font-medium">Account Created</span>
                    <span className="text-gray-600 text-sm">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
                    </span>
                </div>
            </div>

            <button
                onClick={() => {
                    localStorage.clear();
                    router.push('/auth/login');
                }}
                className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
                Log Out
            </button>
        </div>
    );
}