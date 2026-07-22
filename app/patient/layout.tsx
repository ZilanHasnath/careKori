import LogoutButton from '@/components/LogoutButton';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen">
                <aside className="w-64 border-r p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-6">Patient Portal</h2>
                    <nav className="flex flex-col gap-2">
                        <Link href="/patient/profile" className="p-2 hover:bg-gray-100 rounded">Profile</Link>
                        <Link href="/patient/searchCaregiver" className="p-2 hover:bg-gray-100 rounded">Search Caregiver</Link>
                        <Link href="/patient/myrequests" className="p-2 hover:bg-gray-100 rounded">My Job Requests</Link>
                        <Link href="/patient/myprogress" className="p-2 hover:bg-gray-100 rounded">My Progress</Link>
                        <Link href="/patient/familymember" className="p-2 hover:bg-gray-100 rounded">My Family Member</Link>

                    </nav>

                    <LogoutButton />
                </aside>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}