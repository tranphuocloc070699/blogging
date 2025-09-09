"use client";
import {create} from "zustand/react";
import React from "react";

export type SheetPlacements = "left" | "right" | "top" | "bottom";

type SheetTypes = {
  view?: React.ReactNode;
  isOpen: boolean;
  placement?: SheetPlacements;
  containerClassName?: string;

  openSheet: () => void;
  closeSheet: () => void;
  setView: (payload: React.ReactNode) => void;
  setPlacement: (payload: SheetPlacements) => void;
  setContainerClassName: (payload: string) => void;
};


export const useSheet = create<SheetTypes>((set) => ({
  isOpen: false,
  placement: "left",
  openSheet: () => set(() => ({isOpen: true})),
  closeSheet: () => set(() => ({isOpen: false})),
  setView: (payload: React.ReactNode) => set(() => ({view: payload})),
  setPlacement: (payload: SheetPlacements) => set(() => ({placement: payload})),
  setContainerClassName: (payload: string) => set(() => ({containerClassName: payload})),
}));