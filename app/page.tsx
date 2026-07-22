import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 ">

      <Navbar />

      <div className="mx-auto max-w-4xl text-center py-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          CareKori
        </h1>
        <p className="mt-2 text-base text-slate-600">
        Your Trusted Platform for Finding Skilled, Compassionate, and Reliable Caregivers for Every Stage of Life.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">





        {/* Patient Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-800">Patient</h2>
            <p className="mt-1 text-xs text-slate-500">Access your health records and appointments</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              href="/auth/register/patient"
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>
        </div>





        {/* Family Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-800">Family</h2>
            <p className="mt-1 text-xs text-slate-500">Stay updated on your loved one&apos;s status</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              href="/auth/register/familymember"
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>
        </div>





        {/* Caregiver Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-800">Caregiver</h2>
            <p className="mt-1 text-xs text-slate-500">Manage patient tasks and daily care logs</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              href="/auth/register/caregiver"
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Admin Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-800">Admin</h2>
            <p className="mt-1 text-xs text-slate-500">System settings and user management</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="inline-flex justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}