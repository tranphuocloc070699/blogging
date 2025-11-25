'use client';


import { SheetPlacements, useSheet } from "@/components/sheet-views/use-sheet";
import { cn } from "@/lib/utils";
import { AlignLeft } from "lucide-react";
import { JSX } from "react";

interface Props {
  view: JSX.Element;
  placement?: SheetPlacements;
  contentClassName?: string;
  className?: string;
}

export default function HamburgerButton({
  view,
  placement = 'left',
  contentClassName = 'max-w-[320px]',
  className,
}: Props) {
  const { openSheet } = useSheet();
  return (
    <button
      aria-label="Open Sidebar Menu"
      className={cn('xl:hidden w-9 h-9 mr-3 sm:mr-4', className)}
      onClick={() => {
        openSheet({ view, placement, contentClassName })
      }
      }
    >
      <AlignLeft className={"w-full h-full"} />
    </button>
  );
}
