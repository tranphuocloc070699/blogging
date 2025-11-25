// lib/useAccessToken.ts  (or inside your editor file)
'use client';

import { useSession } from 'next-auth/react';

export function useClientSession() {
    const { data: session } = useSession();
    return session;
}