import { Metadata } from 'next';
import QueryProvider from '@/components/provider/query-provider';
import Header from '@/components/public/header';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    template: '%s | loffy',
    default: 'loffy - Tech Blog',
  },
  description: 'A blog about web development, React, and modern JavaScript',
  keywords: ['blog', 'web development', 'React', 'JavaScript', 'Next.js'],
  authors: [{ name: 'Loc Tran' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loffy.me',
    siteName: 'loffy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
      <div className="min-h-screen md:space-y-20 space-y-10 editor-command-list-scrollbar">
        <Header />
        <main>{children}</main>
      </div>
    </QueryProvider>
  );
}
