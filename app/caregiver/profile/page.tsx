'use client';

import { useState, useEffect } from 'react';

export default function CaregiverProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setId(parsedUser._id);
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/caregiver/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProfile(data.profile);
                    setFormData(data.profile);
                }
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const res = await fetch('/api/caregiver/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, id }),
        });

        if (res.ok) {
            const data = await res.json();
            setProfile(data.profile);
            setIsEditing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-lg mx-auto p-6">
            {isEditing ? (
                <div className="space-y-4">
                    <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2" placeholder="Name" />
                    <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="w-full border p-2" placeholder="Phone" />
                    <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2" placeholder="Email" />
                    <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full border p-2" placeholder="Location" />
                    <input name="expectedSalary" type="number" value={formData.expectedSalary || ''} onChange={handleChange} className="w-full border p-2" placeholder="Salary" />
                    <input name="experience" value={formData.experience || ''} onChange={handleChange} className="w-full border p-2" placeholder="Experience" />
                    <select name="sex" value={formData.sex || ''} onChange={handleChange} className="w-full border p-2">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="age" type="number" value={formData.age || ''} onChange={handleChange} className="w-full border p-2" placeholder="Age" />
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2">Save</button>
                </div>
            ) : (
                <div className="space-y-2">
                    <h1 className="text-xl font-bold">{profile.name}</h1>
                    <p>Phone: {profile.phoneNumber}</p>
                    <p>Email: {profile.email}</p>
                    <p>Location: {profile.location}</p>
                    <p>Salary: {profile.expectedSalary}</p>
                    <p>Experience: {profile.experience}</p>
                    <p>Sex: {profile.sex}</p>
                    <p>Age: {profile.age}</p>
                    <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2">Edit Profile</button>
                </div>
            )}
        </div>
    );
}