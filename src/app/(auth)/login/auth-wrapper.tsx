"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
export default function AuthWrapper({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  className?: string;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Check if there's a callbackUrl in the query params
      const callbackUrl = searchParams.get('callbackUrl');

      if (callbackUrl) {
        // If there's a callback URL, redirect to it
        router.replace(callbackUrl);
      } else {
        // Otherwise, redirect based on user role
        if (user.role === 'ADMIN') {
          router.replace('/auth');
        } else {
          router.replace('/');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, searchParams]);

  // Show nothing while checking authentication or if already authenticated
  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50">
      <AuthHeader />

      <div className="flex w-full flex-1 md:items-start items-center justify-center px-5 py-8">
        <div
          className={cn(
            "w-full max-w-md bg-white shadow-lg border border-stone-200 p-8 md:p-10 lg:p-12",
            className,
          )}
        >
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-center text-2xl font-semibold text-stone-800 md:text-3xl">
              {title}
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function AuthHeader() {
  return (
    <header className="flex items-center justify-between p-4 lg:px-16 lg:py-6 2xl:px-24">
      <Link href={"/"} className="flex items-center space-x-2">
        <Image alt="logo" src="/logo.svg" width={120} height={40} />
      </Link>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link
          href="/"
          className="inline-flex items-center gap-x-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 md:px-4 md:py-2.5"
        >
          Back to Home
        </Link>
      </div>
    </header>
  );
}

const footerMenu = [
  {
    name: "Help",
    href: "/",
  },
  {
    name: "Privacy",
    href: "/",
  },
  {
    name: "Terms",
    href: "/",
  },
];

function AuthFooter() {
  return (
    <footer className="flex flex-col-reverse items-center justify-between px-4 py-5 lg:flex-row lg:px-16 lg:py-6 2xl:px-24 2xl:py-10">
      <div className="text-center text-sm leading-relaxed text-stone-500 lg:text-start">
        © 2024 Rainy & Coffee. All rights reserved.
      </div>
      <div className="-mx-2.5 flex items-center justify-end pb-3 text-sm font-medium text-stone-600 lg:w-1/2 lg:pb-0">
        {footerMenu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="px-2.5 py-1.5 transition-colors hover:text-blue-600"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </footer>
  );
}
