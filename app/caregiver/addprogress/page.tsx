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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium text-sm tracking-wide">Loading active patients...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-6 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Active Patients</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track daily vitals and review historical progress logs.
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200/70 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {jobs.length} Active {jobs.length === 1 ? 'Patient' : 'Patients'}
                </span>
            </div>

            {jobs.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 max-w-xl mx-auto">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-slate-900 font-semibold text-base mb-1">No Active Assignments</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">There are currently no active patient assignments linked to your caregiver account.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                        >
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-base border border-slate-200/60 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {job.patientId?.name ? job.patientId.name.charAt(0).toUpperCase() : 'P'}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                {job.patientId?.name || 'Unnamed Patient'}
                                            </h2>
                                            <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {job.patientId?._id?.slice(-6) || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200/60 uppercase tracking-wider">
                                        Active
                                    </span>
                                </div>

                                <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 font-medium">Phone</span>
                                        <span className="font-semibold text-slate-800">{job.patientId?.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 font-medium">Location</span>
                                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[180px] text-right">{job.patientId?.location || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => handleOpenHistoryModal(job)}
                                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-3 text-xs rounded-xl transition-all border border-slate-200/80 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                                >
                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    History
                                </button>

                                <button
                                    onClick={() => handleOpenModal(job)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-3 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Log Daily
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedJob && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Log Daily Progress</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Patient: <span className="font-semibold text-slate-800">{selectedJob.patientId?.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-700 h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-800">Blood Pressure (SYS / DIA)</span>
                                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                        {formData.sys} / {formData.dia} <span className="text-[10px] text-indigo-400 font-normal">mmHg</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                                            <span>Systolic</span>
                                            <span>{formData.sys}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="80"
                                            max="180"
                                            value={formData.sys}
                                            onChange={(e) => setFormData({ ...formData, sys: Number(e.target.value) })}
                                            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                                            <span>Diastolic</span>
                                            <span>{formData.dia}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50"
                                            max="120"
                                            value={formData.dia}
                                            onChange={(e) => setFormData({ ...formData, dia: Number(e.target.value) })}
                                            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-800">Heart Rate</span>
                                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                        {formData.heartRate} <span className="text-[10px] text-rose-400 font-normal">BPM</span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="40"
                                    max="150"
                                    value={formData.heartRate}
                                    onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                                    className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-2">Patient Mood</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['Happy 😊', 'Calm 😌', 'Tired 😴', 'Anxious 😟'].map((mood) => (
                                        <button
                                            key={mood}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, patientMood: mood })}
                                            className={`py-2.5 px-2 text-xs rounded-xl border font-medium transition-all text-center active:scale-95 ${formData.patientMood === mood
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
                                <label className="block text-xs font-semibold text-slate-800 mb-2">Medication Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Taken', 'Partial', 'Missed'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, medicineStatus: status })}
                                            className={`py-2.5 px-3 text-xs rounded-xl border font-medium transition-all active:scale-95 ${formData.medicineStatus === status
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Meals Taken</label>
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
                                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">Exercise / Activity</label>
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
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-800 mb-1.5">Caregiver Notes</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add any specific observations or warnings..."
                                    className="w-full border border-slate-200 p-3 text-xs rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-800 resize-none transition-all placeholder:text-slate-400"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 active:scale-95"
                                >
                                    {submitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                    {submitting ? 'Saving Log...' : 'Submit Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {historyPatient && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Patient Progress History</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    History logs for <span className="font-semibold text-slate-800">{historyPatient.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseHistoryModal}
                                className="text-slate-400 hover:text-slate-700 h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {loadingHistory ? (
                                <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                                    <span className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                                    <p className="text-xs text-slate-500 font-medium">Fetching progress logs...</p>
                                </div>
                            ) : historyLogs.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 text-xs">
                                    No historical progress logs recorded for this patient.
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
                                            className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                                <span className="font-semibold text-slate-800">{formattedDate}</span>
                                                <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium text-[11px] shadow-2xs">
                                                    {log.patientMood || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                                                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Blood Pressure</span>
                                                    <span className="font-semibold text-slate-800">{log.bloodPressure || 'N/A'}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Heart Rate</span>
                                                    <span className="font-semibold text-rose-600">{log.heartRate ? `${log.heartRate} BPM` : 'N/A'}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Medication</span>
                                                    <span className="font-semibold text-slate-800">{log.medicineStatus || 'N/A'}</span>
                                                </div>
                                                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Meals</span>
                                                    <span className="font-semibold text-slate-800">{log.meals || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {log.exercise && (
                                                <div className="pt-1">
                                                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-2">Activity:</span>
                                                    <span className="text-slate-700 font-medium">{log.exercise}</span>
                                                </div>
                                            )}

                                            {log.note && (
                                                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-slate-700 italic">
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
                                className="px-5 py-2.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95"
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