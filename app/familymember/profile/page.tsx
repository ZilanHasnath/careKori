'use client';

import { useState, useEffect } from 'react';

export default function FamilyMemberProfile() {
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

        fetch(`/api/family/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProfile(data.profile);
                    setFormData({
                        name: data.profile.familyMemberName,
                        phoneNumber: data.profile.phoneNumber,
                        email: data.profile.email || '',
                        relationToPatient: data.profile.relationToPatient || ''
                    });
                }
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const res = await fetch('/api/family/profile', {
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
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" placeholder="Name" />
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border p-2" placeholder="Phone" />
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2" placeholder="Email" />
                    <input name="relationToPatient" value={formData.relationToPatient} onChange={handleChange} className="w-full border p-2" placeholder="Relation to Patient" />
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2">Save</button>
                </div>
            ) : (
                <div className="space-y-2">
                    <h1 className="text-xl font-bold">{profile.familyMemberName}</h1>
                    <p>Phone: {profile.phoneNumber}</p>
                    <p>Email: {profile.email || 'N/A'}</p>
                    <p>Location: {profile.location}</p>
                    <p>Relation: {profile.relationToPatient || 'Not specified'}</p>
                    <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2">Edit Profile</button>
                </div>
            )}
        </div>
    );
}