'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-20 h-10 bg-gray-100 rounded-full animate-pulse" />;
  }

  const href = user ? '/profile' : '/login';
  const label = user ? 'Profile' : 'Login';

  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
    >
      <User className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </Link>
  );
}
