"use client";
import {create} from "zustand/react";
import React from "react";

export type DrawerPlacements = "left" | "right" | "top" | "bottom";

type DrawerTypes = {
  view?: React.ReactNode;
  isOpen: boolean;
  placement?: DrawerPlacements;
  containerClassName?: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  setView: (payload: React.ReactNode) => void;
  setPlacement: (payload: DrawerPlacements) => void;
  setContainerClassName: (payload: string) => void;
};


export const useDrawer = create<DrawerTypes>((set) => ({
  isOpen: false,
  placement: "bottom",
  openDrawer: () => set(() => ({isOpen: true})),
  closeDrawer: () => set(() => ({isOpen: false})),
  setView: (payload: React.ReactNode) => set(() => ({view: payload})),
  setPlacement: (payload: DrawerPlacements) => set(() => ({placement: payload})),
  setContainerClassName: (payload: string) => set(() => ({containerClassName: payload})),
}));