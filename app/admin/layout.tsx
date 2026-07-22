import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r p-6 space-y-4">
                <h2 className="font-bold text-lg mb-6">Patient Portal</h2>
                <nav className="flex flex-col gap-2">
                    <Link href="/admin/profile" className="p-2 hover:bg-gray-100 rounded">Profile</Link>
                    <Link href="/admin/addnewadmin" className="p-2 hover:bg-gray-100 rounded">Add New Admin</Link>
                    <Link href="/admin/manage-admins" className="p-2 hover:bg-gray-100 rounded">Manage Admins</Link>
                    <Link href="/admin/caregiver" className="p-2 hover:bg-gray-100 rounded">Caregivers</Link>
                    <Link href="/admin/job" className="p-2 hover:bg-gray-100 rounded">Running Jobs</Link>
                    <Link href="/admin/patient" className="p-2 hover:bg-gray-100 rounded">Patients</Link>
                    <Link href="/admin/family" className="p-2 hover:bg-gray-100 rounded">Family Members</Link>
                </nav>
                <LogoutButton/>
            </aside>

            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}