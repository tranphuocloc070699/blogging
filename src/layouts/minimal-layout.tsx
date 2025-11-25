'use client';

import {HTMLAttributes, ReactNode, useEffect} from 'react';

interface MinimalLayoutProps extends HTMLAttributes<HTMLDivElement>{
  children: ReactNode;
}

/**
 * MinimalLayout - A reusable layout component that hides the sidebar
 * Use this for full-width pages like post editor, settings, etc.
 */
export default function MinimalLayout({ children }: MinimalLayoutProps) {
  useEffect(() => {
    // Add class to body to hide sidebar
    document.body.classList.add('minimal-layout');

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('minimal-layout');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
