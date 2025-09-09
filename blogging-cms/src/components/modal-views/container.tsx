"use client"

import React, {useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {usePathname} from "next/navigation";
import {useModal} from "@/components/modal-views/use-modal";

const GlobalModal = () => {

  const pathname = usePathname();
  const {view, isOpen, containerClassName, closeModal, hideCloseButton} = useModal()

  function onOpenChange(open: boolean) {
    !open && closeModal();
  }

  useEffect(() => {
    closeModal();
  }, [pathname]);

  return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent hideCloseButton={hideCloseButton} className={containerClassName}>
          <DialogHeader>
            <DialogTitle className={"hidden"}></DialogTitle>
            {
              view
            }
          </DialogHeader>

        </DialogContent>
      </Dialog>
  );
};

export default GlobalModal;