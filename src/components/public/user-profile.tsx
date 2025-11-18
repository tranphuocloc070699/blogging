import { getInitials } from '@/lib/string-util';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user.store';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '../ui';



const UserProfile = () => {
        const { user, isAuthenticated } = useUserStore();


        const partialUsername = useMemo(() => {
                if (user.role === 'ADMIN') return 'AD'
                if (!isAuthenticated) return <User />

                return getInitials(user.username);

        }, [user, isAuthenticated])


        return (
                <div>
                        <Button asChild className={cn('rounded-full h-[38px] w-[38px] font-semibold text-sm')}>
                                <Link href={"/profile"}>
                                        {partialUsername}</Link>
                        </Button>
                </div>
        )
}

export default UserProfile