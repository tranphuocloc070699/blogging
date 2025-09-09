"use client"

import React, {useMemo} from "react";
import {cn} from "@/lib/utils";
import {useClientWidth} from "@/hooks/use-client-width"; // Or use your utility for merging classNames

type Props = {
  appearOn: "mobile" | "desktop";
  children: React.ReactNode;
  className?: string;
};

const BREAKPOINT = 768;

const DeviceViews = ({appearOn, children, className}: Props) => {
  const clientWidth = useClientWidth();

  const currentDevice = useMemo(() => {
    return clientWidth < BREAKPOINT ? "mobile" : "desktop";
  }, [clientWidth]);

  if (appearOn !== currentDevice) return null;

  return (<div className={cn(className)}>
    {children}
  </div>);
};

export default DeviceViews;