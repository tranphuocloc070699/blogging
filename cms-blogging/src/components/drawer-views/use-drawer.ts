"use client";
import {create} from "zustand";
import React from "react";

export type DrawerPlacements = "left" | "right" | "top" | "bottom";

type DrawerTypes = {
  view?: React.ReactNode;
  isOpen: boolean;
  placement?: DrawerPlacements;
  containerClassName?: string;
  openDrawer: (
      view: React.ReactNode,
      placement?: DrawerPlacements,
      containerClassName?: string
  ) => void;
  closeDrawer: () => void;
};

export const useDrawer = create<DrawerTypes>((set) => ({
  isOpen: false,
  view: null,
  containerClassName: "",
  openDrawer: (view, placement = "bottom", containerClassName) =>
      set({
        isOpen: true,
        view,
        placement,
        containerClassName,
      }),
  closeDrawer: () =>
      set({
        isOpen: false,
        view: null,
        placement: "bottom",
      }),
}));