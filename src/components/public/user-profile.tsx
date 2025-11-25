"use client"

import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/string-util';
import { User as UserIcon } from 'lucide-react';
import type { Session } from 'next-auth';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserProfile() {
        const { data: session, status } = useSession();
        if (status === 'loading') {
                return (
                        <div className="rounded-full h-[38px] w-[38px] bg-stone-200 animate-pulse" />
                );
        }

        let partialUsername: React.ReactNode = <UserIcon className="h-5 w-5" />;

        if (session?.user) {
                const user = session.user as Session['user'];
                if (user.role === "ADMIN") {
                        partialUsername = "AD";
                } else if (user.username) {
                        partialUsername = getInitials(user.username);
                }
        }

        return (
                <div>
                        <Button asChild className={cn('rounded-full h-[38px] w-[38px] font-semibold text-sm')}>
                                <Link href={session?.user ? "/profile" : "/login"}>
                                        {partialUsername}</Link>
                        </Button>
                </div>
        );
}

