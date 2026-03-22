import type { Metadata } from "next";
import "./globals.css";
import { inter, mono, noto } from "@/config/fonts";
import { siteConfig } from "@/config/site.config";
import ThemeProvider from "@/components/provider/theme-provider";
import GlobalModal from "@/components/modal-views/container";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import PrismaHealthCheck from "@/components/health/prisma-health-check";
import Script from "next/script";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log({ env: process.env.NEXT_PUBLIC_GA_ID });
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${noto.variable} ${inter.variable} ${mono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(){window.dataLayer.push(arguments);}
          window.gtag('js', new Date());
          window.gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { debug_mode: true });
        `}</Script>
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
