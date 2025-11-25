
import Logo from "@/components/logo";
import { SheetHeader as ShadcnSheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from 'lucide-react';
import Link from "next/link";

interface SheetProps {
  title?: string;
  onSheetClose: () => void;
}

const SheetHeader = ({ title, onSheetClose }: SheetProps) => {


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
              <Logo className="h-7" />
            </Link>
          }
          <X className={"w-5 h-5 cursor-pointer"} onClick={onSheetClose} />
        </div>


      </SheetTitle>
    </ShadcnSheetHeader>
  );
};

export default SheetHeader;