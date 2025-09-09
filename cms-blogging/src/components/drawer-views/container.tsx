"use client"

import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button";
import {useDrawer} from "@/components/drawer-views/use-drawer";


const GlobalDrawer = () => {
  const {isOpen, view, containerClassName, placement, openDrawer, closeDrawer} = useDrawer();


  return (
      <Drawer open={isOpen} onClose={closeDrawer} direction={placement}>
        <DrawerContent className={"z-[1000]"}>
          <div>
            {view}
          </div>
        </DrawerContent>
      </Drawer>
  )
};

export default GlobalDrawer;