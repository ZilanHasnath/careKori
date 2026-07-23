'use client';

import { useState, useEffect } from 'react';
import {
    Heart,
    Activity,
    Smile,
    Pill,
    Calendar,
    Utensils,
    Dumbbell,
    FileText,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

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

export default function PatientProgressPage() {
    const [logs, setLogs] = useState<ProgressLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setError('User session not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(storedUser);
                const patientId = user._id || user.id;

                const res = await fetch(`/api/patient/myprogress?patientId=${patientId}`);
                const data = await res.json();

                if (res.ok && data.progress) {
                    setLogs(data.progress);
                } else {
                    setError(data.error || 'Failed to load progress reports.');
                }
            } catch (err) {
                console.error('Error fetching progress:', err);
                setError('A network error occurred while loading your health data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Heart className="w-4 h-4 text-indigo-600 absolute animate-pulse" />
                </div>
                <p className="text-slate-500 font-medium text-sm">Fetching your latest health logs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="p-6 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-rose-700 shadow-sm space-y-3">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 underline underline-offset-4"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Try again
                    </button>
                </div>
            </div>
        );
    }

    const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

    const parseBP = (bpStr?: string) => {
        if (!bpStr) return { sys: 0, dia: 0 };
        const parts = bpStr.split('/').map((val) => parseInt(val.trim(), 10));
        return { sys: parts[0] || 0, dia: parts[1] || 0 };
    };

    const maxHeartRate = Math.max(...logs.map((l) => l.heartRate || 0), 100);
    const maxBP = Math.max(...logs.map((l) => parseBP(l.bloodPressure).sys), 160);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                            Health Tracker
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                        My Health Progress
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track daily vitals, meds, diet, and overall wellbeing logs.
                    </p>
                </div>
            </div>

            {logs.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">No logs recorded yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Once you or your caregiver start logging daily health vitals, they will show up here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-slate-900">
                                    {latestLog?.bloodPressure || 'N/A'}
                                </span>
                                <span className="text-xs font-medium text-slate-400">mmHg</span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-2 block">Most recent reading</span>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Heart Rate</span>
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                    <Heart className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-rose-600">
                                    {latestLog?.heartRate ? latestLog.heartRate : 'N/A'}
                                </span>
                                <span className="text-xs font-medium text-slate-400">BPM</span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-2 block">Most recent pulse</span>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Mood</span>
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                    <Smile className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-lg font-bold text-slate-800 capitalize truncate block">
                                    {latestLog?.patientMood || 'N/A'}
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-2 block">Latest logged state</span>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medication</span>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Pill className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    {latestLog?.medicineStatus || 'N/A'}
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-2 block">Medication compliance</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Blood Pressure History</h2>
                                    <p className="text-xs text-slate-400">Systolic vs Diastolic comparison</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium">
                                    <span className="flex items-center gap-1.5 text-indigo-600">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Sys
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sky-500">
                                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Dia
                                    </span>
                                </div>
                            </div>

                            <div className="h-48 flex items-end gap-2 border-b border-slate-100 pb-2 pt-6 px-2 relative">
                                {logs.map((log, index) => {
                                    const { sys, dia } = parseBP(log.bloodPressure);
                                    const sysHeight = Math.min((sys / maxBP) * 100, 100);
                                    const diaHeight = Math.min((dia / maxBP) * 100, 100);
                                    const dateLabel = new Date(log.dateTime || log.createdAt || '').toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div key={log._id || index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            <div className="absolute -top-10 hidden group-hover:flex bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap font-medium pointer-events-none">
                                                {sys}/{dia} mmHg
                                            </div>

                                            <div className="w-full max-w-[24px] flex items-end justify-center gap-0.5 h-full">
                                                <div
                                                    style={{ height: `${sysHeight}%` }}
                                                    className="w-1/2 bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-700"
                                                ></div>
                                                <div
                                                    style={{ height: `${diaHeight}%` }}
                                                    className="w-1/2 bg-sky-400 rounded-t-md transition-all group-hover:bg-sky-500"
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Heart Rate Trend</h2>
                                    <p className="text-xs text-slate-400">Beats Per Minute (BPM)</p>
                                </div>
                                <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                                    BPM
                                </span>
                            </div>

                            <div className="h-48 flex items-end gap-2 border-b border-slate-100 pb-2 pt-6 px-2 relative">
                                {logs.map((log, index) => {
                                    const hr = log.heartRate || 0;
                                    const height = Math.min((hr / maxHeartRate) * 100, 100);
                                    const dateLabel = new Date(log.dateTime || log.createdAt || '').toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div key={log._id || index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            <div className="absolute -top-10 hidden group-hover:flex bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap font-medium pointer-events-none">
                                                {hr} BPM
                                            </div>

                                            <div className="w-full max-w-[18px] flex items-end justify-center h-full">
                                                <div
                                                    style={{ height: `${height}%` }}
                                                    className="w-full bg-rose-500 rounded-t-md transition-all group-hover:bg-rose-600"
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Daily Log History</h2>
                            <span className="text-xs font-medium text-slate-500">{logs.length} Total Entries</span>
                        </div>

                        <div className="space-y-4">
                            {[...logs].reverse().map((log) => {
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
                                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors space-y-4"
                                    >
                                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span>{formattedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {log.patientMood && (
                                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                                                        Mood: {log.patientMood}
                                                    </span>
                                                )}
                                                {log.medicineStatus && (
                                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-medium">
                                                        {log.medicineStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                                                    Blood Pressure
                                                </span>
                                                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                                                    {log.bloodPressure || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">
                                                    Heart Rate
                                                </span>
                                                <span className="font-bold text-rose-600 text-sm mt-0.5 block">
                                                    {log.heartRate ? `${log.heartRate} BPM` : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block flex items-center gap-1">
                                                    <Utensils className="w-3 h-3 text-slate-400" /> Meals
                                                </span>
                                                <span className="font-semibold text-slate-700 mt-0.5 block truncate">
                                                    {log.meals || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block flex items-center gap-1">
                                                    <Dumbbell className="w-3 h-3 text-slate-400" /> Activity
                                                </span>
                                                <span className="font-semibold text-slate-700 mt-0.5 block truncate">
                                                    {log.exercise || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {log.note && (
                                            <div className="flex gap-2.5 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/60 text-xs text-indigo-950">
                                                <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                                <p className="leading-relaxed font-normal">{log.note}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}