'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RegisterCaregiverPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        location: 'Dhaka',
        speciality: 'General Care',
        expectedSalary: '',
        experience: '',
        sex: 'Male',
        age: '',
        nationalIdPassportNo: '',
        password: '',
    });

    const cities = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Mymensingh', 'Rangpur', 'Cumilla', 'Barishal', 'Narayanganj', 'Gazipur'];
    const specialityOptions = ['General Care', 'Old-age Care', 'Paralysis', 'Accident Patient', 'Other'];
    const experienceOptions = ['1-2 Years', '3-5 Years', '5+ Years'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            speciality: [formData.speciality],
            expectedSalary: parseInt(formData.expectedSalary),
            age: parseInt(formData.age),
        };

        try {
            const res = await fetch('/api/auth/register/caregiver', {
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
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Caregiver Registration</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="email" type="email" placeholder="Email (Optional)" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="expectedSalary" type="number" placeholder="Expected Salary" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input name="nationalIdPassportNo" placeholder="National ID or Passport No" onChange={handleChange} className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />

                    <select name="sex" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="location" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>

                    <select name="illness" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {specialityOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>

                    <select name="experience" onChange={handleChange} className="w-full border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        {experienceOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                    </select>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all">
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}