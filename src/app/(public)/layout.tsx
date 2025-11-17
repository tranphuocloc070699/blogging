import { Metadata } from 'next';
import PublicHeader from '@/components/blog/layout/PublicHeader';
import QueryProvider from '@/components/provider/query-provider';
import Header from '@/components/public/header';

export const metadata: Metadata = {
  title: {
    template: '%s | Raynox',
    default: 'Raynox - Tech Blog',
  },
  description: 'A blog about web development, React, and modern JavaScript',
  keywords: ['blog', 'web development', 'React', 'JavaScript', 'Next.js'],
  authors: [{ name: 'Loc Tran' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://raynox.com',
    siteName: 'Raynox',
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
      <div className="min-h-screen md:space-y-20 space-y-10 editor-command-list-scrollbar">
        <Header />
        <main>{children}</main>
      </div>
    </QueryProvider>
  );
}
