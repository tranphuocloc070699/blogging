"use client";
import {create} from "zustand/react";
import React from "react";
import {DrawerPlacements} from "@/components/drawer-views/use-drawer";

export type SheetPlacements = "left" | "right" | "top" | "bottom";


interface SheetProps {
  view?: React.ReactNode;
  isOpen?: boolean;
  placement?: SheetPlacements;
  openSheet: (props: Pick<SheetProps, "view" | "placement" | "contentClassName">) => void;
  closeSheet: () => void;
  contentClassName?: string;
}


export const useSheet = create<SheetProps>((set) => ({
  props: {
    isOpen: false,
    placement: "right"
  },
  openSheet: ({view, placement, contentClassName}) => set({
    isOpen: true,
    view,
    placement,
    contentClassName
  }),
  closeSheet: () => set({isOpen: false, view: null, placement: "left", contentClassName: ""})
}));