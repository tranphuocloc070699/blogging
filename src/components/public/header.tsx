'use client';

import { useEffect, useMemo, useState } from 'react';

import { ContactRound, Newspaper, UserRoundPen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../shared/logo';
import MobileMenu from './mobile-menu';
import NavbarItem from './navbar-item';
import UserProfileWrapper from './user-profile-wrapper';
import { useClientSession } from '@/hooks/use-client-session';
import { USER_ROLE } from '@/config/enums';


export default function Header() {
        const pathname = usePathname();
        const router = useRouter();
        const [showHeader, setShowHeader] = useState(true);
        const [lastScrollY, setLastScrollY] = useState(0);
        const session = useClientSession();
        const navItems = useMemo(() => {
                const navItems = [
                        { href: '/', label: 'Post', icon: Newspaper },
                        // { href: '/book', label: 'Book', icon: BookOpenText },
                        { href: '/about', label: 'About', icon: ContactRound },
                ]
                if (session?.user?.role === USER_ROLE.USER || session?.user?.role === USER_ROLE.ADMIN) {
                        navItems.push({
                                href: "/auth",
                                label: "Manager",
                                icon: UserRoundPen
                        })
                }

                return navItems


        }, [session]);

        const variant = useMemo(() => {
                if (pathname.includes("posts/")) {
                        return "back"
                }
                return "default";
        }, [
                pathname
        ])

        // Scroll detection for sticky header when variant is "back"
        useEffect(() => {
                if (variant !== "back") {
                        setShowHeader(true);
                        return;
                }

                const handleScroll = () => {
                        const currentScrollY = window.scrollY;

                        if (currentScrollY < lastScrollY) {
                                // Scrolling up
                                setShowHeader(true);
                        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                                // Scrolling down and past 100px
                                setShowHeader(false);
                        }

                        setLastScrollY(currentScrollY);
                };

                window.addEventListener('scroll', handleScroll, { passive: true });
                return () => window.removeEventListener('scroll', handleScroll);
        }, [variant, lastScrollY]);

        const handleBack = () => {
                router.back();
        };

        return (
                <>
                        {/* Desktop Header */}
                        <header className="hidden md:block bg-white border-b border-gray-200">
                                <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
                                        {/* Logo */}
                                        <div className='flex items-center gap-6'>
                                                <Logo variant='default' />
                                                <nav className="flex items-center gap-2">
                                                        {navItems.map((item) => (
                                                                <NavbarItem
                                                                        key={item.href}
                                                                        href={item.href}
                                                                        label={item.label}
                                                                        isActive={pathname === item.href}
                                                                />
                                                        ))}
                                                </nav>
                                        </div>

                                        {/* User Profile */}
                                        <UserProfileWrapper />
                                </div>
                        </header>

                        {/* Mobile Header */}
                        <header
                                className={`md:hidden bg-white border-b border-gray-200 transition-all duration-300 ${variant === "back"
                                        ? `sticky top-0 z-40 ${showHeader ? 'translate-y-0' : '-translate-y-full'
                                        }`
                                        : ''
                                        }`}
                        >
                                <div className="px-4 h-16 flex items-center justify-between">
                                        {/* Logo or Back Button */}
                                        <Logo variant={variant as 'default' | 'back'} onBack={handleBack} />

                                        {/* Mobile Menu */}
                                        <MobileMenu navItems={navItems} />
                                </div>
                        </header>
                </>
        );
}