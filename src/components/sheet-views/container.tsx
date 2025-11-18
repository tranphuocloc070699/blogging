"use client"

import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";
import React, { useEffect } from 'react';

import SheetHeader from "@/components/sheet-views/sheet-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";




interface CustomSheetProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  placement?: "left" | "right" | "top" | "bottom";
  contentClassName?: string;
}

const CustomSheet = ({ title, isOpen, setIsOpen, children, contentClassName, placement = "right" }: CustomSheetProps) => {
  const pathname = usePathname();
  // const {view, title, isOpen, placement, contentClassName, closeSheet} = useSheet()

  function onOpenChange(open: boolean) {
    !open && closeSheet();
  }
  useEffect(() => {
    closeSheet();
  }, [pathname]);

  function closeSheet() {
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side={placement} className={cn(contentClassName)}>
        <SheetHeader title={title} onSheetClose={closeSheet} />
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;