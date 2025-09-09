"use client"

import React from 'react';
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const Navbar = () => {
  const pathName = usePathname();
  const t = useTranslations("Navbar");
  const navItems = [
    // {href: "/learning", label: t("learning")},
    // {href: "/e-book", label: t("ebook")},
    {href: "/news", label: t("news")},
    {href: "/about", label: t("about")}
  ];


  return (
      <nav className="flex md:flex-row flex-col md:gap-0 gap-4 ">
        {navItems.map((item) => (
            <Link
                className={cn("flex items-center md:border-none border-b border-neutral-600 justify-between font-normal text-sm text-gray-500 hover:bg-gray-100 md:p-2 md:px-4 p-4 md:rounded-pill transition-all", pathName === item.href ? ' font-bold text-black-primary' : '')}
                key={item.href}
                href={item.href}>
              {item.label}
            </Link>
        ))}
      </nav>
  );
};

export default Navbar;