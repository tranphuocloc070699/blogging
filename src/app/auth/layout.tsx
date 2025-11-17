"use client"

import React from 'react';
import {useLayout} from "@/hooks/use-layout";
import {useIsMounted} from "@/hooks/use-is-mounted";
import HydrogenLayout from "@/layouts/hydrogen/layout"
import {LayoutProps} from "@/config/props";
import AuthGuard from '@/components/auth/auth-guard';

const Layout = ({children}: LayoutProps) => {
  const {layout} = useLayout();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  // if (layout === LAYOUT_OPTIONS.HELIUM) {
  //   return <HeliumLayout>{children}</HeliumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.LITHIUM) {
  //   return <LithiumLayout>{children}</LithiumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.BERYLLIUM) {
  //   return <BerylLiumLayout>{children}</BerylLiumLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.BORON) {
  //   return <BoronLayout>{children}</BoronLayout>;
  // }
  // if (layout === LAYOUT_OPTIONS.CARBON) {
  //   return <CarbonLayout>{children}</CarbonLayout>;
  // }

  return (
    <AuthGuard requireAdmin>
      <HydrogenLayout>{children}</HydrogenLayout>
    </AuthGuard>
  );
};

export default Layout;