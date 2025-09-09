"use client";
import {create} from "zustand";
import React from "react";


interface ModalProps {
  view?: React.ReactNode;
  containerClassName?: string;
  isOpen?: boolean;
  hideCloseButton?: boolean;
  openModal: (props: Pick<ModalProps, "view" | "containerClassName" | "hideCloseButton">) => void;
  closeModal: () => void;
}

export const useModal = create<ModalProps>((set) => ({
  props: {
    isOpen: false,
    view: null,
    containerClassName: "",
    hideCloseButton: false
  },
  openModal: ({view, containerClassName, hideCloseButton}) =>
      set({isOpen: true, view, containerClassName, hideCloseButton}),
  closeModal: () =>
      set({isOpen: false, view: null, containerClassName: "", hideCloseButton: false})
}));