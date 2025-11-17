"use client"

import React, { useState, useEffect } from 'react';
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
}

const Logo = ({iconOnly = false, className}: LogoProps) => {
  const {theme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by showing default until mounted
  if (!mounted) {
    return <img className={cn(className)} alt={"Logo"} src="/logo.svg" />;
  }

  return (
      <img className={cn(className)} alt={"Logo"}
           src={theme === "dark" ? "/light-logo.svg" : "/logo.svg"}/>
  );
};

export default Logo;
