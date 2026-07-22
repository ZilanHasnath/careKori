'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className=" bg-amber-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-extrabold tracking-tight text-gray-900 hover:opacity-80 transition"
                >
                    careKori<span className="text-blue-600">.</span>
                </Link>

            </div>
        </header>
    );
}