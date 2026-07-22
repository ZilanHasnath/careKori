"use client";

import { useEffect, useState } from "react";

interface FamilyMember {
    _id: string;
    familyMemberName: string;
    phoneNumber: string;
    email?: string;
    location: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function FamilyMembersPage() {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFamilyMembers() {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    setError("Patient identity not found. Please log in.");
                    setLoading(false);
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                const patientId = parsedUser._id || parsedUser.id;

                if (!patientId) {
                    setError("Invalid user data stored. Please log in again.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `/api/patient/family/connected?patientId=${patientId}`
                );
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to load connected family members.");
                }

                setMembers(data.familyMembers || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchFamilyMembers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                    Loading connected family members...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connected Family Members</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Family members linked to your profile who have access to monitor your care progress.
                </p>
            </div>

            {members.length === 0 ? (
                <div className="p-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-500 font-medium text-sm">
                        No family members are currently linked to your account.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((member) => {
                        const joinedDate = member.createdAt
                            ? new Date(member.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })
                            : "N/A";

                        return (
                            <div
                                key={member._id}
                                className="p-5 border border-slate-200/80 bg-white rounded-2xl shadow-xs space-y-4"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm uppercase">
                                            {member.familyMemberName ? member.familyMemberName.charAt(0) : "F"}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900">{member.familyMemberName}</h2>
                                            <span className="text-[11px] text-slate-400 font-medium">Linked Family Account</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400">Phone Number</span>
                                        <span className="font-semibold text-slate-900">{member.phoneNumber}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400">Email</span>
                                        <span className="font-semibold text-slate-900">{member.email || "N/A"}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400">Location</span>
                                        <span className="font-semibold text-slate-900">{member.location}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-0.5 border-t border-slate-100 pt-2 text-[11px]">
                                        <span className="text-slate-400">Connected Since</span>
                                        <span className="font-medium text-slate-500">{joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}