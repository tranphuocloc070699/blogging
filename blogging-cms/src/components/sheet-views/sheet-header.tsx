import React from 'react';

import Link from "next/link";
import Logo from "@/components/logo";
import {X} from 'lucide-react';
import {useSheet} from "@/components/sheet-views/use-sheet";
import {SheetHeader as ShadcnSheetHeader, SheetTitle, SheetClose} from "@/components/ui/sheet";

interface SheetProps {
  title?: string;
}

const SheetHeader = ({title}: SheetProps) => {
  const {closeSheet} = useSheet();

  return (
      <ShadcnSheetHeader>
        <SheetTitle>
          <div
              className="sticky top-0 z-40 bg-gray-0/10 px-6 pt-4 pb-2 dark:bg-gray-100/5 flex items-center justify-between">
            {
              title ? <h4>{title}</h4> : <Link
                  href={'/public'}
                  aria-label="Site Logo"
              >
                <Logo className="h-7"/>
              </Link>
            }
            <X className={"w-5 h-5 cursor-pointer"} onClick={closeSheet}/>
          </div>


        </SheetTitle>
      </ShadcnSheetHeader>
  );
};

export default SheetHeader;