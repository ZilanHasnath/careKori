'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface PatientProgressLog {
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
    patientId?: {
        _id: string;
        patientName?: string;
        uniqueId?: string;
    };
}

function ProgressContent() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');

    const [logs, setLogs] = useState<PatientProgressLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!patientId) {
            setLoading(false);
            setError('No patient ID provided in URL.');
            return;
        }

        const fetchProgress = async () => {
            try {
                const res = await fetch(`/api/family/patientprogress?patientId=${patientId}`);
                const data = await res.json();

                if (res.ok && data.logs) {
                    setLogs(data.logs);
                } else {
                    setError(data.error || 'Failed to fetch patient progress.');
                }
            } catch (err) {
                console.error(err);
                setError('Network error loading progress records.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                    Loading health progress report...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="p-6 bg-rose-50/80 border border-rose-200/60 rounded-2xl text-rose-800 shadow-xs backdrop-blur-xs">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-600 font-semibold">
                        !
                    </div>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const patientInfo = logs[0]?.patientId;
    const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

    const parseBP = (bpStr?: string) => {
        if (!bpStr) return { sys: 0, dia: 0 };
        const parts = bpStr.split('/').map((val) => parseInt(val.trim(), 10));
        return { sys: parts[0] || 0, dia: parts[1] || 0 };
    };

    const maxHeartRate = Math.max(...logs.map((l) => l.heartRate || 0), 100);
    const maxBP = Math.max(...logs.map((l) => parseBP(l.bloodPressure).sys), 160);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Daily Health Progress
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {patientInfo
                            ? `Showing health progress report for ${patientInfo.patientName || 'Patient'} (${patientInfo.uniqueId || ''})`
                            : 'Track vital signs, medication history, and personal wellbeing logs over time.'}
                    </p>
                </div>
                {patientInfo && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-semibold self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Active Monitoring
                    </div>
                )}
            </div>

            {logs.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-slate-600 font-medium text-sm">
                        No progress logs recorded for this patient yet.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Latest Blood Pressure</span>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-slate-900 tracking-tight">
                                    {latestLog?.bloodPressure || 'N/A'}
                                </span>
                                <span className="text-xs font-medium text-slate-400">mmHg</span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Latest Heart Rate</span>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-rose-600 tracking-tight">
                                    {latestLog?.heartRate ? `${latestLog.heartRate}` : 'N/A'}
                                </span>
                                <span className="text-xs font-medium text-slate-400">BPM</span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Mood</span>
                            <div className="mt-2">
                                <span className="text-lg font-bold text-slate-800">
                                    {latestLog?.patientMood || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Medication Status</span>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    {latestLog?.medicineStatus || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Blood Pressure Trend</h2>
                                    <p className="text-xs text-slate-400">Systolic vs Diastolic readings</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium">
                                    <span className="flex items-center gap-1.5 text-indigo-600">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Systolic
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sky-500">
                                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Diastolic
                                    </span>
                                </div>
                            </div>

                            <div className="h-48 flex items-end gap-3 border-b border-slate-100 pb-3 pt-6 px-2">
                                {logs.map((log, index) => {
                                    const { sys, dia } = parseBP(log.bloodPressure);
                                    const sysHeight = (sys / maxBP) * 100;
                                    const diaHeight = (dia / maxBP) * 100;
                                    const dateLabel = new Date(log.dateTime || log.createdAt || '').toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div key={log._id || index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            <div className="absolute -top-9 hidden group-hover:flex bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap font-medium transition-opacity">
                                                {sys}/{dia} mmHg
                                            </div>

                                            <div className="w-full max-w-[24px] flex items-end justify-center gap-1 h-full">
                                                <div
                                                    style={{ height: `${sysHeight}%` }}
                                                    className="w-1/2 bg-indigo-600 rounded-t-md transition-all duration-300 group-hover:bg-indigo-700"
                                                />
                                                <div
                                                    style={{ height: `${diaHeight}%` }}
                                                    className="w-1/2 bg-sky-400 rounded-t-md transition-all duration-300 group-hover:bg-sky-500"
                                                />
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Heart Rate History</h2>
                                    <p className="text-xs text-slate-400">Beats per minute</p>
                                </div>
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">BPM</span>
                            </div>

                            <div className="h-48 flex items-end gap-3 border-b border-slate-100 pb-3 pt-6 px-2">
                                {logs.map((log, index) => {
                                    const hr = log.heartRate || 0;
                                    const height = (hr / maxHeartRate) * 100;
                                    const dateLabel = new Date(log.dateTime || log.createdAt || '').toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div key={log._id || index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            <div className="absolute -top-9 hidden group-hover:flex bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl z-20 whitespace-nowrap font-medium">
                                                {hr} BPM
                                            </div>

                                            <div className="w-full max-w-[20px] flex items-end justify-center h-full">
                                                <div
                                                    style={{ height: `${height}%` }}
                                                    className="w-full bg-rose-500 rounded-t-md transition-all duration-300 group-hover:bg-rose-600"
                                                />
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
                            <h2 className="text-lg font-bold text-slate-900">Detailed Daily Logs</h2>
                            <span className="text-xs text-slate-400 font-medium">{logs.length} record(s)</span>
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
                                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                                    >
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                <span className="font-bold text-xs text-slate-800">{formattedDate}</span>
                                            </div>
                                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                                                {log.patientMood || 'Mood N/A'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                            <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Blood Pressure</span>
                                                <span className="font-bold text-slate-800 text-sm">{log.bloodPressure || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Heart Rate</span>
                                                <span className="font-bold text-rose-600 text-sm">{log.heartRate ? `${log.heartRate} BPM` : 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Medication</span>
                                                <span className="font-bold text-slate-800 text-sm">{log.medicineStatus || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Meals</span>
                                                <span className="font-bold text-slate-800 text-sm">{log.meals || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {log.exercise && (
                                            <div className="text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Activity</span>
                                                <span className="text-slate-700 font-semibold">{log.exercise}</span>
                                            </div>
                                        )}

                                        {log.note && (
                                            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/80 text-xs text-amber-900 font-medium">
                                                &ldquo;{log.note}&rdquo;
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

export default function FamilyPatientProgressPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">
                        Loading health progress report...
                    </p>
                </div>
            }
        >
            <ProgressContent />
        </Suspense>
    );
}