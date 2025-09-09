"use client"

import React from 'react';
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDrawer} from "@/app/shared/drawer-views/use-drawer";
import {useSheet} from "@/app/shared/sheet-views/use-sheet";
import Navbar from "@/components/layout/navbar";

const HamburgerButton = () => {
  const {openSheet, setView} = useSheet()

  function onIconClick() {
    setView(<Navbar/>)
    openSheet();
  }

  return (
      <Menu className={"w-9 h-9"} onClick={onIconClick}/>
  );
};

export default HamburgerButton;