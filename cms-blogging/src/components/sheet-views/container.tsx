"use client"

import React, {useEffect} from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {usePathname} from "next/navigation";
import {useSheet} from "@/components/sheet-views/use-sheet";
import {cn} from "@/lib/utils";

const GlobalSheet = () => {
  const pathname = usePathname();
  const {view, isOpen, placement, contentClassName, closeSheet} = useSheet()

  function onOpenChange(open: boolean) {
    !open && closeSheet();
  }

  useEffect(() => {
    console.log({isOpen})
  }, [isOpen])

  useEffect(() => {
    closeSheet();
  }, [pathname]);

  console.log({contentClassName})
  return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side={placement} className={cn(contentClassName)}>
          <SheetHeader>
            <SheetTitle className={"hidden"}></SheetTitle>
            <SheetDescription className={"hidden"}></SheetDescription>
          </SheetHeader>
          {view}
        </SheetContent>
      </Sheet>
  );
};

export default GlobalSheet;