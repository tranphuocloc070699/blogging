'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Posts', href: '/' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors ${
            pathname === item.href
              ? 'text-black'
              : 'text-gray-700 hover:text-black'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
