"use client"

import { useModal } from "@/components/modal-views/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { useEffect } from 'react';

const GlobalModal = () => {

  const pathname = usePathname();
  const { view, isOpen, containerClassName, closeModal, hideCloseButton } = useModal()

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