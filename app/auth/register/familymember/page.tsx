'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RegisterFamilyMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        familyMemberName: '',
        phoneNumber: '',
        email: '',
        password: '',
        location: 'Dhaka',
    });

    const cities = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Mymensingh', 'Rangpur', 'Cumilla', 'Barishal', 'Narayanganj', 'Gazipur'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register/familyMember', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/auth/login');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Family Member Registration</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input name="familyMemberName" placeholder="Full Name" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="email" type="email" placeholder="Email (Optional)" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <select name="location" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all">
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}