"use client";
import {create} from "zustand/react";
import React from "react";


export type SheetPlacements = "left" | "right" | "top" | "bottom";


interface SheetProps {
  view?: React.ReactNode;
  isOpen?: boolean;
  placement?: SheetPlacements;
  title?: string;
  openSheet: (props: Pick<SheetProps, "view" | "placement" | "contentClassName" | "title">) => void;
  closeSheet: () => void;
  contentClassName?: string;
}


export const useSheet = create<SheetProps>((set) => ({
  props: {
    isOpen: false,
    placement: "right"
  },
  openSheet: ({view, placement, contentClassName, title}) => set({
    isOpen: true,
    view,
    title,
    placement,
    contentClassName
  }),
  closeSheet: () => set({
    isOpen: false,
    view: null,
    placement: "right",
    contentClassName: "",
    title: ""
  })
}));