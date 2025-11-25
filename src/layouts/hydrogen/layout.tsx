"use client"

import React, { useEffect, useState } from 'react';
import { LayoutProps } from "@/config/props";
import Sidebar from "@/layouts/hydrogen/sidebar";
import Header from "@/layouts/hydrogen/header";
import { useTermStore } from '@/store/term.store';
import { useTaxonomyStore } from '@/store/taxonomy.store';

const HydrogenLayout = ({ children }: LayoutProps) => {
  const [isMinimalLayout, setIsMinimalLayout] = useState(false);


  const termStore = useTermStore();
  const taxonomyStore = useTaxonomyStore();

  useEffect(() => {
    termStore.initialTerms();
    taxonomyStore.initialTaxonomies();
  }, [])

  useEffect(() => {
    // Check if body has minimal-layout class
    const checkMinimalLayout = () => {
      setIsMinimalLayout(document.body.classList.contains('minimal-layout'));
    };

    // Initial check
    checkMinimalLayout();

    // Create observer to watch for class changes
    const observer = new MutationObserver(checkMinimalLayout);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (isMinimalLayout) {
    return (
      <main className="flex min-h-screen flex-grow">
        <div className="flex w-full flex-col">
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-grow">
      <Sidebar className="fixed hidden xl:block dark:bg-gray-50" />
      <div
        className="flex w-full flex-col xl:ml-[270px]  xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
        <Header />
        <div
          className="flex flex-grow flex-col px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9">
          {children}
        </div>
      </div>
    </main>
  );
};

export default HydrogenLayout;