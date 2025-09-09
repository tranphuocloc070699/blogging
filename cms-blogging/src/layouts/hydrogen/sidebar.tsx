'use client';
import Link from 'next/link';

import Logo from "@/components/logo";
import {cn} from "@/lib/utils";
import SimpleBar from "@/components/simple-bar";
import SidebarMenu from "@/layouts/hydrogen/sidebar-menu";

export default function Sidebar({className}: { className?: string }) {
  return (
      <aside
          className={cn(
              'fixed bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white dark:bg-gray-100/50 2xl:w-72',
              className
          )}
      >
        <div
            className="sticky top-0 z-40 bg-gray-0/10 px-6 pb-5 pt-5 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
          <Link
              href={'/'}
              aria-label="Site Logo"
          >
            <Logo className=" h-7"/>
          </Link>
        </div>

        <SimpleBar className="h-[calc(100%-80px)]">
          <SidebarMenu/>
        </SimpleBar>
      </aside>
  );
}
