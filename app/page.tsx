'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  HeartPulse, 
  Award
} from 'lucide-react';

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
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const portals = [
    {
      title: 'Patient Portal',
      desc: 'Access medical records and manage upcoming caregiver visits.',
      icon: User,
      loginUrl: '/auth/login',
      registerUrl: '/auth/register/patient',
    },
    {
      title: 'Family Portal',
      desc: 'Stay informed with real-time health updates for loved ones.',
      icon: Users,
      loginUrl: '/auth/login',
      registerUrl: '/auth/register/familymember',
    },
    {
      title: 'Caregiver Portal',
      desc: 'View schedules, log care details, and connect with clients.',
      icon: HeartHandshake,
      loginUrl: '/auth/login',
      registerUrl: '/auth/register/caregiver',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FEF7EC] to-[#FFF8E7] text-slate-800 font-sans overflow-x-hidden">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:px-12 lg:pt-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              We take care of your <span className="text-amber-500">loved ones</span> with experts
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-slate-600 lg:text-lg">
              Empowering families with compassionate, background-checked caregivers for seniors, medical recovery, and specialized daily support.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3.5">
              <Link
                href="#portals"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-3.5 text-base font-bold text-amber-950 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-xl active:scale-95"
              >
                Find Caregiver
              </Link>
              <Link
                href="/auth/register/caregiver"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 sm:border-transparent px-6 py-3.5 text-base font-bold text-slate-700 transition-all hover:bg-amber-100/50"
              >
                Join as Caregiver
                <ArrowRight className="h-4 w-4 text-amber-500" />
              </Link>
            </div>

            <div className="mt-10 sm:mt-12 border-t border-amber-200/50 pt-6 sm:pt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Care Categories</p>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-400/20 ring-4 ring-white shadow-xs overflow-hidden text-xl sm:text-2xl">
                    👴
                  </div>
                  <span className="text-xs font-medium text-slate-600">Elderly</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-300/20 ring-4 ring-white shadow-xs overflow-hidden text-xl sm:text-2xl">
                    🩺
                  </div>
                  <span className="text-xs font-medium text-slate-600">Recovery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-500/20 ring-4 ring-white shadow-xs overflow-hidden text-xl sm:text-2xl">
                    ♿
                  </div>
                  <span className="text-xs font-medium text-slate-600">Special Need</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-6 lg:justify-end mt-4 lg:mt-0 px-4">
            <div className="absolute top-4 sm:top-8 -left-2 sm:left-2 lg:-left-4 z-20 flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-white/90 p-2.5 sm:p-3 pr-4 sm:pr-5 shadow-lg backdrop-blur-md">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Verified</p>
                <p className="text-[10px] text-slate-500">Background Checked</p>
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-8 -right-2 sm:right-2 lg:right-0 z-20 flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-white/90 p-2.5 sm:p-3 pr-4 sm:pr-5 shadow-lg backdrop-blur-md">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white bg-slate-300" />
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white bg-slate-400" />
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white bg-slate-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">150K+</p>
                <p className="text-[10px] text-slate-500">Happy Families</p>
              </div>
            </div>

            <div className="relative h-[360px] sm:h-[420px] lg:h-[460px] w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] overflow-hidden rounded-t-[140px] sm:rounded-t-[180px] rounded-b-[32px] sm:rounded-b-[40px] border-4 sm:border-8 border-white bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-100 shadow-xl sm:shadow-2xl">
              <Image
                src="/care.jpg"
                alt="Caregiver helping senior"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 lg:px-12">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Choose Your Access Portal</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">Select your account type to manage care or log into your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.title}
                className="group flex flex-col justify-between rounded-3xl border border-amber-100 bg-white/80 p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl backdrop-blur-xs"
              >
                <div>
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition-colors group-hover:bg-amber-400 group-hover:text-amber-950">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-slate-900">{portal.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">{portal.desc}</p>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 sm:gap-3">
                  <Link
                    href={portal.loginUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-sm font-semibold text-amber-950 transition-all hover:bg-amber-400 active:scale-95 shadow-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href={portal.registerUrl}
                    className="flex w-full items-center justify-center rounded-2xl border border-amber-300 bg-amber-50/50 py-3 text-sm font-semibold text-amber-900 transition-all hover:bg-amber-100 hover:border-amber-400 active:scale-95"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 sm:mt-12 bg-amber-100/60 py-10 sm:py-12 border-t border-amber-200/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md">
                <HeartPulse className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Health & Wellness Care</h4>
                <p className="text-xs text-slate-600">Daily health monitoring and personalized recovery assistance.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Certified & Vetted</h4>
                <p className="text-xs text-slate-600">Rigorous background checks and verified qualifications for all staff.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md">
                <Award className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Affordable Care Plans</h4>
                <p className="text-xs text-slate-600">Flexible hourly or long-term options tailored to your family's budget.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
