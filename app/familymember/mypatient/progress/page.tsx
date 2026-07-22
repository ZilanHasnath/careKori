'use client';

import { useState, useEffect } from 'react';
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

export default function FamilyPatientProgressPage() {
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                    Loading health progress report...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    const patientInfo = logs[0]?.patientId;
    const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

    // Helper function to parse Blood Pressure "SYS/DIA"
    const parseBP = (bpStr?: string) => {
        if (!bpStr) return { sys: 0, dia: 0 };
        const parts = bpStr.split('/').map((val) => parseInt(val.trim(), 10));
        return { sys: parts[0] || 0, dia: parts[1] || 0 };
    };

    // Calculate dynamic maximums for chart scaling
    const maxHeartRate = Math.max(...logs.map((l) => l.heartRate || 0), 100);
    const maxBP = Math.max(...logs.map((l) => parseBP(l.bloodPressure).sys), 160);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Daily Health Progress
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    {patientInfo
                        ? `Showing health progress report for ${patientInfo.patientName || 'Patient'} (${patientInfo.uniqueId || ''})`
                        : 'Track vital signs, medication history, and personal wellbeing logs over time.'}
                </p>
            </div>

            {logs.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-slate-500 font-medium text-sm">
                        No progress logs recorded for this patient yet.
                    </p>
                </div>
            ) : (
                <>
                    {/* Key Vitals Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                            <span className="text-[11px] font-medium text-slate-400 block">Latest Blood Pressure</span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold text-slate-900">
                                    {latestLog?.bloodPressure || 'N/A'}
                                </span>
                                <span className="text-[10px] text-slate-400">mmHg</span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                            <span className="text-[11px] font-medium text-slate-400 block">Latest Heart Rate</span>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-xl font-bold text-rose-600">
                                    {latestLog?.heartRate ? `${latestLog.heartRate}` : 'N/A'}
                                </span>
                                <span className="text-[10px] text-slate-400">BPM</span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                            <span className="text-[11px] font-medium text-slate-400 block">Current Mood</span>
                            <div className="mt-1">
                                <span className="text-lg font-semibold text-slate-800">
                                    {latestLog?.patientMood || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                            <span className="text-[11px] font-medium text-slate-400 block">Medication Status</span>
                            <div className="mt-1">
                                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    {latestLog?.medicineStatus || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Trend Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Blood Pressure Chart */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-bold text-slate-900">Blood Pressure Trend</h2>
                                <div className="flex items-center gap-3 text-[10px] font-medium">
                                    <span className="flex items-center gap-1 text-indigo-600">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Systolic
                                    </span>
                                    <span className="flex items-center gap-1 text-sky-500">
                                        <span className="w-2 h-2 rounded-full bg-sky-500"></span> Diastolic
                                    </span>
                                </div>
                            </div>

                            <div className="h-44 flex items-end gap-2 border-b border-slate-100 pb-2 pt-4 px-2">
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
                                            {/* Hover Tooltip */}
                                            <div className="absolute -top-8 hidden group-hover:flex bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md shadow-md z-10 whitespace-nowrap">
                                                {sys}/{dia} mmHg
                                            </div>

                                            <div className="w-full max-w-[20px] flex items-end justify-center gap-0.5 h-full">
                                                <div
                                                    style={{ height: `${sysHeight}%` }}
                                                    className="w-1/2 bg-indigo-600 rounded-t-sm transition-all"
                                                ></div>
                                                <div
                                                    style={{ height: `${diaHeight}%` }}
                                                    className="w-1/2 bg-sky-400 rounded-t-sm transition-all"
                                                ></div>
                                            </div>
                                            <span className="text-[9px] text-slate-400 mt-2 truncate w-full text-center">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Heart Rate Chart */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-bold text-slate-900">Heart Rate History</h2>
                                <span className="text-[10px] font-medium text-rose-600">BPM</span>
                            </div>

                            <div className="h-44 flex items-end gap-2 border-b border-slate-100 pb-2 pt-4 px-2">
                                {logs.map((log, index) => {
                                    const hr = log.heartRate || 0;
                                    const height = (hr / maxHeartRate) * 100;
                                    const dateLabel = new Date(log.dateTime || log.createdAt || '').toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    return (
                                        <div key={log._id || index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                            {/* Hover Tooltip */}
                                            <div className="absolute -top-8 hidden group-hover:flex bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md shadow-md z-10 whitespace-nowrap">
                                                {hr} BPM
                                            </div>

                                            <div className="w-full max-w-[16px] flex items-end justify-center h-full">
                                                <div
                                                    style={{ height: `${height}%` }}
                                                    className="w-full bg-rose-500 rounded-t-sm transition-all"
                                                ></div>
                                            </div>
                                            <span className="text-[9px] text-slate-400 mt-2 truncate w-full text-center">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Timeline List */}
                    <div className="space-y-4">
                        <h2 className="text-base font-bold text-slate-900">Detailed Daily Logs</h2>
                        <div className="space-y-3">
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
                                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3"
                                    >
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                                            <span className="font-semibold text-xs text-slate-800">{formattedDate}</span>
                                            <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
                                                {log.patientMood || 'Mood N/A'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
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
                                            <div className="text-xs">
                                                <span className="text-slate-400 block text-[10px]">Activity</span>
                                                <span className="text-slate-700 font-medium">{log.exercise}</span>
                                            </div>
                                        )}

                                        {log.note && (
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
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