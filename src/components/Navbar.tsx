'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname.startsWith('/dashboard')) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F1E8]">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/images/genesis_logo.png" alt="Genesis" className="h-10" />
                    <span className="text-xl font-semibold text-gray-900">GENESIS</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm text-gray-700">
                    <Link href="#" className="hover:text-gray-900">Leaderboard</Link>
                    <Link href="#" className="hover:text-gray-900">How It Works</Link>
                </div>

                <Link href="/auth/signin">
                    <button className="px-6 py-2 bg-white border border-gray-400 text-gray-800 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                        ADMIN LOGIN
                    </button>
                </Link>
            </div>
        </nav>
    );
}
