import LogoutButton from '@/components/LogoutButton';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function FamilyDashboard({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />

            <div className="flex min-h-screen">
                <aside className="w-64 border-r p-6 space-y-4">
                    <h2 className="font-bold text-lg mb-6">Patient Portal</h2>
                    <nav className="flex flex-col gap-2">
                        <Link href="/familymember/profile" className="p-2 hover:bg-gray-100 rounded">Profile</Link>
                        <Link href="/familymember/mypatient" className="p-2 hover:bg-gray-100 rounded">My Patient</Link>
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