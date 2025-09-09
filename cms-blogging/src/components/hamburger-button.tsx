'use client';

import {
  DrawerPlacements,
  useDrawer,
} from '@/components/drawer-views/use-drawer';
import {JSX} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useSheet} from "@/components/sheet-views/use-sheet";
import {AlignLeft} from "lucide-react";

interface Props {
  view: JSX.Element;
  placement?: DrawerPlacements;
  containerClassName?: string;
  className?: string;
}

export default function HamburgerButton({
                                          view,
                                          placement = 'left',
                                          containerClassName = 'max-w-[320px] p-0',
                                          className,
                                        }: Props) {
  const {openSheet} = useSheet();
  return (
      <button
          aria-label="Open Sidebar Menu"
          className={cn('xl:hidden w-9 h-9 mr-3 sm:mr-4', className)}
          onClick={() => {
            openSheet({view, placement, contentClassName: containerClassName})
          }
          }
      >
        <AlignLeft className={"w-full h-full"}/>
      </button>
  );
}
