"use client"

import React, { useEffect, useRef } from 'react';
import SearchTrigger from "@/components/search/search-trigger";
import { useModal } from "@/components/modal-views/use-modal";
import SearchList from "@/components/search/search-list";

interface SearchWidgetProps {
  className?: string;
  icon?: React.ReactNode;
  placeholderClassName?: string;
}

const SearchWidget = ({ className, icon, placeholderClassName }: SearchWidgetProps) => {
  const { openModal, closeModal, isOpen } = useModal();

  const modalView = useRef({
    view: <SearchList />,
    containerClassName: "p-0 w-[90%] rounded-lg",
    hideCloseButton: true,
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        isOpen ? closeModal() : openModal(modalView.current)
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openModal]);


  return (
    <SearchTrigger
      icon={icon}
      className={className}
      onClick={() => {
        openModal(modalView.current)
      }}
      placeholderClassName={placeholderClassName}
    />
  );
};

export default SearchWidget;