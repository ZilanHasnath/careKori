'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    UserCheck,
    User,
    Phone,
    Mail,
    Lock,
    MapPin,
    Stethoscope,
    DollarSign,
    Briefcase,
    BadgeCheck,
    Calendar,
    Loader2,
    ArrowRight
} from 'lucide-react';

const BD_PHONE_REGEX = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

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
        experience: '1-2 Years',
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
        setError(null);

        const trimmedPhone = formData.phoneNumber.trim();
        if (!BD_PHONE_REGEX.test(trimmedPhone)) {
            setError('Please enter a valid Bangladeshi phone number (e.g., 017XXXXXXXX or +88017XXXXXXXX)');
            return;
        }

        const trimmedEmail = formData.email.trim();
        if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            name: formData.name.trim(),
            phoneNumber: trimmedPhone,
            email: trimmedEmail || undefined,
            nationalIdPassportNo: formData.nationalIdPassportNo.trim(),
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Caregiver Registration
                    </h1>
                    <p className="text-sm text-slate-600">
                        Join our care network to offer professional assistance to families
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100">
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    name="name"
                                    placeholder="e.g. Nasreen Akter"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="017XXXXXXXX"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Email <span className="text-slate-400 lowercase font-normal">(optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    NID / Passport
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <BadgeCheck className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="nationalIdPassportNo"
                                        placeholder="NID or Passport No"
                                        value={formData.nationalIdPassportNo}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Age
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="age"
                                        type="number"
                                        placeholder="e.g. 28"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Gender
                                </label>
                                <div className="relative">
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Expected Salary
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <input
                                        name="expectedSalary"
                                        type="number"
                                        placeholder="BDT"
                                        value={formData.expectedSalary}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Location
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Speciality
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Stethoscope className="h-4 w-4" />
                                    </div>
                                    <select
                                        name="speciality"
                                        value={formData.speciality}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        {specialityOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                                    Experience
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        {experienceOptions.map(exp => (
                                            <option key={exp} value={exp}>{exp}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60 pt-3.5 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Complete Registration</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
                        Already registered as a caregiver?{' '}
                        <Link href="/auth/login" className="font-semibold text-amber-600 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}