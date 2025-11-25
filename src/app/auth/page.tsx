'use client';

import { useEffect, useState } from 'react';
export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    sessions: 0,
    users: 0,
    bounceRate: 0,
  });

  useEffect(() => {
    // Simulate fetching analytics data
    // In production, you would fetch this from Google Analytics API
    const mockData = {
      pageViews: 1250,
      sessions: 890,
      users: 654,
      bounceRate: 42.5,
    };
    setAnalytics(mockData);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 ">
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
              href={`https://analytics.google.com/analytics/web/#/a375944085p514187757/reports/intelligenthome`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-stone-800">View Full Dashboard</p>
              <p className="text-sm text-stone-600">
                Open Google Analytics Console
              </p>
            </a>
            <a
              href="https://support.google.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-stone-800">Documentation</p>
              <p className="text-sm text-stone-600">
                Learn more about Google Analytics
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-600">{title}</h3>
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
      </div>
      <p className="text-3xl font-bold text-stone-800 mb-1">{value}</p>
      <p className="text-sm text-stone-500">{description}</p>
    </div>
  );
}