import type {Metadata} from "next";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import Header from "@/components/layout/header";
import {roboto} from "@/app/fonts";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import GlobalSheet from "@/app/shared/sheet-views/container";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const title = messages?.Meta?.title || 'My Blogging';
  const description = messages?.Meta?.description || 'Default Description';
  return {
    title,
    description
  };
}

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();

  return (
      <html lang={locale} suppressHydrationWarning>
      <body
          suppressHydrationWarning
          className={`${roboto.variable}`}
      >
      <NextIntlClientProvider>
        <GlobalDrawer/>
        <GlobalSheet/>
        <GlobalModal/>
        <Header/>
        <section className={"md:pt-20 pt-10"}>
          {children}
        </section>
      </NextIntlClientProvider>
      </body>
      </html>
  );
}
