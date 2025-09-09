"use client"

import React, {useEffect} from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {usePathname} from "next/navigation";
import {useSheet} from "@/components/sheet-views/use-sheet";
import {cn} from "@/lib/utils";
import SheetHeader from "@/components/sheet-views/sheet-header";

const GlobalSheet = () => {
  const pathname = usePathname();
  const {view, title, isOpen, placement, contentClassName, closeSheet} = useSheet()

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
          <SheetHeader title={title}/>
          {view}
        </SheetContent>
      </Sheet>
  );
};

export default GlobalSheet;