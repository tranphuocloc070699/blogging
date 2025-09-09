import React from 'react';
import {cn} from "@/lib/utils";

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
}

const Logo = ({iconOnly = false, className}: LogoProps) => {
  return (
      <img className={cn(className)} alt={"Logo"}
           src={iconOnly ? "/short-logo.svg" : "logo.svg"}/>
  );
};

export default Logo;
