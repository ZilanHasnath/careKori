'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RegisterPatientPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        email: '',
        password: '',
        age: '',
        sex: 'Male',
        location: 'Dhaka',
        illness: 'General Care',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cities = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Mymensingh', 'Rangpur', 'Cumilla', 'Barishal', 'Narayanganj', 'Gazipur'];
    const illnessOptions = ['General Care', 'Old-age Care', 'Paralysis', 'Accident Patient', 'Other'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            patientName: formData.patientName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
            age: parseInt(formData.age),
            sex: formData.sex,
            location: formData.location,
            illness: [formData.illness],
        };

        try {
            const res = await fetch('/api/auth/register/patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Patient Registration</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input name="patientName" placeholder="Full Name" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="email" type="email" placeholder="Email (Optional)" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <select name="sex" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="location" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <select name="illness" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {illnessOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all">
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}