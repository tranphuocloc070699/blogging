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
import {useSheet} from "@/app/shared/sheet-views/use-sheet";
import {usePathname} from "next/navigation";
import Logo from "@/components/layout/logo";

const GlobalSheet = () => {
  const pathname = usePathname();
  const {isOpen, view, placement, openSheet, closeSheet} = useSheet()

  function onOpenChange(open: boolean) {
    if (open) return openSheet()
    else return closeSheet();
  }

  useEffect(() => {
    closeSheet();
  }, [pathname]);

  return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side={placement} className={"w-screen z-1000"}>
          <SheetHeader>
            <SheetTitle><Logo withBrandName/></SheetTitle>
          </SheetHeader>
          {view}
        </SheetContent>
      </Sheet>
  );
};

export default GlobalSheet;