import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";

function AuthFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Input skeletons */}
      <div className="space-y-4">
        <div className="h-10 bg-stone-200 rounded-md"></div>
        <div className="h-10 bg-stone-200 rounded-md"></div>
        <div className="h-10 bg-stone-200 rounded-md"></div>
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-stone-300 rounded-md"></div>

      {/* Link skeleton */}
      <div className="flex justify-center">
        <div className="h-4 w-48 bg-stone-200 rounded"></div>
      </div>
    </div>
  );
}

export default function AuthWrapper({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  className?: string;
}) {
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

          <Suspense fallback={<AuthFormSkeleton />}>
            {children}
          </Suspense>
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