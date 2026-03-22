import { Metadata } from "next";
import Header from "@/components/public/header";

export const metadata: Metadata = {
  title: {
    template: "%s | loffy",
    default: "loffy - Tech Blog",
  },
  description: "A blog about web development, React, and modern JavaScript",
  keywords: ["blog", "web development", "React", "JavaScript", "Next.js"],
  authors: [{ name: "Loc Tran" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loffy.me",
    siteName: "loffy",
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
    <div className="min-h-screen md:space-y-20 space-y-10 editor-command-list-scrollbar">
      <Header />
      <main>{children}</main>
    </div>
  );
}
