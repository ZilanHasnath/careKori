'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Users, HeartHandshake, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const role = localStorage.getItem('role');
      const roleRoutes: Record<string, string> = {
        patient: '/patient',
        caregiver: '/caregiver',
        family: '/familymember',
        familymember: '/familymember',
        admin: '/admin',
        superadmin: '/admin',
      };

      if (role && roleRoutes[role]) {
        router.replace(roleRoutes[role]);
      } else {
        setIsCheckingAuth(false);
      }
    } catch (e) {
      console.error('Failed to read role from localStorage', e);
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const roles = [
    {
      title: 'Patient',
      desc: 'Access your health records and appointments.',
      icon: User,
      registerUrl: '/auth/register/patient',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Family',
      desc: "Stay updated on your loved one's status.",
      icon: Users,
      registerUrl: '/auth/register/familymember',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Caregiver',
      desc: 'Manage patient tasks and daily care logs.',
      icon: HeartHandshake,
      registerUrl: '/auth/register/caregiver',
      lightBg: 'bg-teal-50',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-100',
    },
    {
      title: 'Admin',
      desc: 'System settings and user management.',
      icon: ShieldCheck,
      registerUrl: null,
      lightBg: 'bg-slate-100',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-200',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 text-center sm:pt-20 sm:pb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Caregiving Made Simple, <br className="hidden sm:inline" />
          <span className="text-blue-600">Reliable & Compassionate.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Your Trusted Platform for Finding Skilled, Compassionate, and Reliable Caregivers for Every Stage of Life.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.lightBg} ${role.textColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${role.lightBg} ${role.textColor} ${role.borderColor}`}>
                      Portal
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                    {role.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-2.5">
                  <Link
                    href="/auth/login"
                    className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <span>Login</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>

                  {role.registerUrl && (
                    <Link
                      href={role.registerUrl}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}