import React from 'react';
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
}

const Logo = ({iconOnly = false, className}: LogoProps) => {
  const {theme} = useTheme();

  return (
      <img className={cn(className)} alt={"Logo"}
           src={theme === "light" ? "/logo.svg" : "/light-logo.svg"}/>
  );
};

export default Logo;
