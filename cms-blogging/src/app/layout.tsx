import type {Metadata} from "next";
import "./globals.css";
import {inter, mono, noto} from "@/config/fonts";
import {siteConfig} from "@/config/site.config";
import ThemeProvider from "@/components/provider/theme-provider";
import GlobalSheet from "@/components/sheet-views/container";
import GlobalModal from "@/components/modal-views/container";

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
      <html lang="en" suppressHydrationWarning>
      <body
          className={`${noto.variable} ${inter.variable} ${mono.variable} antialiased`}
          suppressHydrationWarning
      >
      <ThemeProvider>

        {children}
        <GlobalSheet/>
        <GlobalModal/>
      </ThemeProvider>
      </body>
      </html>
  );
}
