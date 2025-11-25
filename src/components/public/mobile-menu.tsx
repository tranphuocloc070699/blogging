'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { useUserStore } from '@/store/user.store';
import UserProfileWrapper from './user-profile-wrapper';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { user } = useUserStore();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="secondary" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserProfileWrapper />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">{user.username.length > 0 ? user.username : "Let's Login"}</span>
              <span className="text-xs text-gray-500">{user.email ? user.email : "Click the icon to login"}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : ''
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
