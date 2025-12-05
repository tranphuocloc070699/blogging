'use client';

import { useClientSession } from "@/hooks/use-client-session";
import {USER_ROLE} from "@/config/enums";

export default function AnalyticsPage() {
  const session = useClientSession();

  // Optional: show a loading state while the session is being fetched
  if (session === undefined) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-stone-600">Loading...</p>
        </div>
    );
  }

  const isAdmin = session?.user?.role === USER_ROLE.ADMIN;

  // Regular USER → no permission
  if (!isAdmin) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-stone-50">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-stone-800 mb-4">
              Access Denied
            </h1>
            <p className="text-lg text-stone-600">
              You don't have permission to view this content.
            </p>
            <p className="mt-4 text-sm text-stone-500">
              This page is restricted to administrators only.
            </p>
          </div>
        </div>
    );
  }

  // ADMIN → full analytics dashboard
  return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-stone-600">
              Google Analytics tracking for Loffy Blog
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-stone-200 p-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-4">
              Quick Links
            </h2>
            <div className="space-y-3">
              <a
                  href="https://analytics.google.com/analytics/web/#/a375944085p514187757/reports/intelligenthome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-stone-800">View Full Dashboard</p>
                <p className="text-sm text-stone-600">
                  Open Google Analytics Console
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}