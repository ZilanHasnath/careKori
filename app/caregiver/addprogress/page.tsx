'use client';

import { useState, useEffect } from 'react';

interface Patient {
    _id: string;
    name?: string;
    phoneNumber?: string;
    location?: string;
    email?: string;
}

interface Job {
    _id: string;
    patientId: Patient;
    status: string;
    dateTime: string;
}

interface ProgressLog {
    _id: string;
    bloodPressure?: string;
    heartRate?: number;
    meals?: string;
    exercise?: string;
    medicineStatus?: string;
    patientMood?: string;
    note?: string;
    dateTime?: string;
    createdAt?: string;
}

export default function AddPatientProgressPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);


    const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);
    const [historyLogs, setHistoryLogs] = useState<ProgressLog[]>([]);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        sys: 120,
        dia: 80,
        heartRate: 72,
        meals: 'Full Meal',
        exercise: 'Light Walk',
        medicineStatus: 'Taken',
        patientMood: 'Happy 😊',
        note: '',
    });

    useEffect(() => {
        const fetchActiveJobs = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(storedUser);
                const caregiverId = user._id || user.id;

                const res = await fetch(`/api/caregiver/myjobs?caregiverId=${caregiverId}`);
                const data = await res.json();

                if (res.ok && data.jobs) {
                    const activeJobs = data.jobs.filter((j: Job) => j.status === 'Active');
                    setJobs(activeJobs);
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveJobs();
    }, []);


    const handleOpenModal = (job: Job) => {
        setSelectedJob(job);
        setFormData({
            sys: 120,
            dia: 80,
            heartRate: 72,
            meals: 'Full Meal',
            exercise: 'Light Walk',
            medicineStatus: 'Taken',
            patientMood: 'Happy 😊',
            note: '',
        });
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };


    const handleOpenHistoryModal = async (job: Job) => {
        if (!job.patientId?._id) return;

        setHistoryPatient(job.patientId);
        setLoadingHistory(true);
        setHistoryLogs([]);

        try {
            const storedUser = localStorage.getItem('user');
            const caregiverId = storedUser ? JSON.parse(storedUser)._id || JSON.parse(storedUser).id : '';

            const res = await fetch(
                `/api/caregiver/patient/history?patientId=${job.patientId._id}&caregiverId=${caregiverId}`
            );
            const data = await res.json();

            if (res.ok && data.history) {
                setHistoryLogs(data.history);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleCloseHistoryModal = () => {
        setHistoryPatient(null);
        setHistoryLogs([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const storedUser = localStorage.getItem('user');
        if (!storedUser || !selectedJob) {
            alert('User or Patient information missing.');
            return;
        }

        const user = JSON.parse(storedUser);
        const caregiverId = user._id || user.id;

        setSubmitting(true);

        const payload = {
            jobId: selectedJob._id,
            caregiverId,
            patientId: selectedJob.patientId._id,
            bloodPressure: `${formData.sys}/${formData.dia}`,
            heartRate: formData.heartRate,
            meals: formData.meals,
            exercise: formData.exercise,
            medicineStatus: formData.medicineStatus,
            patientMood: formData.patientMood,
            note: formData.note,
        };

        try {
            const res = await fetch('/api/caregiver/addprogress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Daily progress uploaded successfully!');
                handleCloseModal();
            } else {
                alert(data.error || 'Failed to submit progress');
            }
        } catch (err) {
            console.error(err);
            alert('A network error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    Loading active patients...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Patients</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track daily vitals and review historical progress logs.
                    </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200/60">
                    {jobs.length} Active {jobs.length === 1 ? 'Patient' : 'Patients'}
                </span>
            </div>

            {jobs.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-slate-500 font-medium">No active patient assignments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                        >
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {job.patientId?.name || 'Unnamed Patient'}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">ID: {job.patientId?._id?.slice(-6) || 'N/A'}</p>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-100">
                                        Active
                                    </span>
                                </div>

                                <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                                    <div className="flex items-center text-slate-600">
                                        <span className="w-16 font-medium text-slate-400">Phone</span>
                                        <span className="font-medium text-slate-800">{job.patientId?.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <span className="w-16 font-medium text-slate-400">Location</span>
                                        <span className="font-medium text-slate-800">{job.patientId?.location || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    onClick={() => handleOpenHistoryModal(job)}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    View History
                                </button>

                                <button
                                    onClick={() => handleOpenModal(job)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Log Progress
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {selectedJob && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Log Daily Progress</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Patient: <span className="font-semibold text-slate-800">{selectedJob.patientId?.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 text-xl font-bold h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                                    <span>Blood Pressure (SYS / DIA)</span>
                                    <span className="text-indigo-600 font-bold">{formData.sys} / {formData.dia} <span className="text-[10px] text-slate-400 font-normal">mmHg</span></span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-400 block mb-1">Systolic ({formData.sys})</label>
                                        <input
                                            type="range"
                                            min="80"
                                            max="180"
                                            value={formData.sys}
                                            onChange={(e) => setFormData({ ...formData, sys: Number(e.target.value) })}
                                            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block mb-1">Diastolic ({formData.dia})</label>
                                        <input
                                            type="range"
                                            min="50"
                                            max="120"
                                            value={formData.dia}
                                            onChange={(e) => setFormData({ ...formData, dia: Number(e.target.value) })}
                                            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>




                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                                    <span>Heart Rate</span>
                                    <span className="text-rose-600 font-bold">{formData.heartRate} <span className="text-[10px] text-slate-400 font-normal">BPM</span></span>
                                </div>
                                <input
                                    type="range"
                                    min="40"
                                    max="150"
                                    value={formData.heartRate}
                                    onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                                    className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                />
                            </div>




                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Patient Mood</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Happy 😊', 'Calm 😌', 'Tired 😴', 'Anxious 😟'].map((mood) => (
                                        <button
                                            key={mood}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, patientMood: mood })}
                                            className={`py-2 px-1 text-xs rounded-xl border font-medium transition-all text-center ${formData.patientMood === mood
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            {mood}
                                        </button>
                                    ))}
                                </div>
                            </div>




                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Medication Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Taken', 'Partial', 'Missed'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, medicineStatus: status })}
                                            className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${formData.medicineStatus === status
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>




                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meals Taken</label>
                                <select
                                    value={formData.meals}
                                    onChange={(e) => setFormData({ ...formData, meals: e.target.value })}
                                    className="w-full border border-slate-200 p-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800 cursor-pointer transition-all"
                                >
                                    <option value="Full Meal">Full Meal (Ate everything)</option>
                                    <option value="Half Meal">Half Meal (Ate partially)</option>
                                    <option value="Light Snack">Light Snack</option>
                                    <option value="Refused Meal">Refused Meal</option>
                                </select>
                            </div>




                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exercise / Activity</label>
                                <select
                                    value={formData.exercise}
                                    onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                                    className="w-full border border-slate-200 p-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800 cursor-pointer transition-all"
                                >
                                    <option value="Light Walk">Light Walk (10-15 mins)</option>
                                    <option value="Stretching">Light Stretching / Yoga</option>
                                    <option value="Bed Rest">Bed Rest (No exercise)</option>
                                    <option value="Physical Therapy">Physical Therapy Session</option>
                                </select>
                            </div>




                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Caregiver Notes</label>
                                <textarea
                                    rows={2}
                                    placeholder="Add any specific observations..."
                                    className="w-full border border-slate-200 p-2.5 text-xs rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800 resize-none transition-all"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    {submitting ? 'Saving Log...' : 'Submit Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}




            {historyPatient && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Patient Progress History</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    History for <span className="font-semibold text-slate-800">{historyPatient.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseHistoryModal}
                                className="text-slate-400 hover:text-slate-600 text-xl font-bold h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                &times;
                            </button>
                        </div>



                        <div className="p-5 overflow-y-auto flex-1 space-y-4">
                            {loadingHistory ? (
                                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
                                    <p className="text-xs text-slate-500 font-medium">Fetching progress logs...</p>
                                </div>
                            ) : historyLogs.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 text-xs">
                                    No history records found for this patient.
                                </div>
                            ) : (
                                historyLogs.map((log) => {
                                    const dateStr = log.dateTime || log.createdAt;
                                    const formattedDate = dateStr
                                        ? new Date(dateStr).toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })
                                        : 'N/A';

                                    return (
                                        <div
                                            key={log._id}
                                            className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 text-xs space-y-3"
                                        >
                                            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                                                <span className="font-semibold text-slate-700">{formattedDate}</span>
                                                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-medium">
                                                    {log.patientMood || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-slate-600">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                                                    <span className="font-semibold text-slate-800">{log.bloodPressure || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                                                    <span className="font-semibold text-rose-600">{log.heartRate ? `${log.heartRate} BPM` : 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px]">Medication</span>
                                                    <span className="font-semibold text-slate-800">{log.medicineStatus || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px]">Meals</span>
                                                    <span className="font-semibold text-slate-800">{log.meals || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {log.exercise && (
                                                <div className="pt-1">
                                                    <span className="text-slate-400 block text-[10px]">Activity</span>
                                                    <span className="text-slate-700 font-medium">{log.exercise}</span>
                                                </div>
                                            )}

                                            {log.note && (
                                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-slate-600 italic">
                                                    &ldquo;{log.note}&rdquo;
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>



                        <div className="p-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleCloseHistoryModal}
                                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}