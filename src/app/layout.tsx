import type { Metadata } from "next";
import "./globals.css";
import { inter, mono, noto } from "@/config/fonts";
import { siteConfig } from "@/config/site.config";
import ThemeProvider from "@/components/provider/theme-provider";
import GlobalModal from "@/components/modal-views/container";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import PrismaHealthCheck from "@/components/health/prisma-health-check";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${noto.variable} ${inter.variable} ${mono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SessionProvider
            refetchInterval={0}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
          >
            <PrismaHealthCheck />
            {children}
            <GlobalModal />
            <Toaster position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
