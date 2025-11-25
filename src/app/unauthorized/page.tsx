'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Unauthorized Access</h1>
        <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">Go to Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto">Login as Admin</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}