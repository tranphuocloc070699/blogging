"use client"

import React, {PropsWithChildren, useEffect} from 'react';
import {Settings} from "lucide-react";
import {useSheet} from "@/components/sheet-views/use-sheet";
import ThemeSettings from "@/components/theme-settings/container";
import {useDirection} from "@/hooks/use-direction";

const SettingsButton = ({children}: PropsWithChildren) => {
  const {openSheet} = useSheet();
  const {direction} = useDirection();

  useEffect(() => {
    document.documentElement.dir = direction ?? 'ltr';

  }, [direction]);

  return (
      <div component-name="SettingsButton" onClick={() => {
        console.log("open sheet")
        openSheet({
          view: <ThemeSettings/>,
          title: "Settings",
          placement: "right",
          contentClassName: "w-full"
        })
      }}>
        {children ? (
            children
        ) : (
            <Settings strokeWidth={1.8}
                      className="!h-5 !w-auto animate-spin-slow"/>
        )}
      </div>
  );
};

export default SettingsButton;