'use client';

import { useState, useEffect } from 'react';

export default function PatientProfile() {
    const [patient, setPatient] = useState<any>(null);
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

        fetch(`/api/patient/profile?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPatient(data.patient);
                setFormData(data.patient);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const res = await fetch('/api/patient/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, id }),
        });

        if (res.ok) {
            const data = await res.json();
            setPatient(data.patient);
            setIsEditing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-lg mx-auto p-6">
            {isEditing ? (
                <div className="space-y-4">
                    <input name="patientName" value={formData.patientName || ''} onChange={handleChange} className="w-full border p-2" />
                    <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="w-full border p-2" />
                    <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2" />
                    <input name="age" type="number" value={formData.age || ''} onChange={handleChange} className="w-full border p-2" />
                    <select name="sex" value={formData.sex || ''} onChange={handleChange} className="w-full border p-2">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full border p-2" />
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2">Save</button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className='flex justify-around'>
                        <h1 className="text-xl font-bold">{patient.patientName}</h1>
                        <h1 className='text-2xl'>{patient.uniqueId}</h1>
                    </div>




                    <p>Phone: {patient.phoneNumber}</p>
                    <p>Email: {patient.email}</p>
                    <p>Age: {patient.age}</p>
                    <p>Sex: {patient.sex}</p>
                    <p>Location: {patient.location}</p>
                    <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2">Edit Profile</button>
                </div>
            )}
        </div>
    );
}