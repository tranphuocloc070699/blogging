import { cn } from "@/lib/utils";
import { Command, Search } from "lucide-react";


type SearchTriggerProps = {
  placeholderClassName?: string;
  icon?: React.ReactNode;
  lang?: string;
  t?: (key: string) => string | undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SearchTrigger({
  icon,
  className,
  placeholderClassName,
  t,
  ...props
}: SearchTriggerProps) {
  return (
    <button
      aria-label="Search"
      className={cn(
        'group inline-flex items-center active:translate-y-px',
        // kill default outlines everywhere
        'outline-none focus:outline-none focus-visible:outline-none',
        // accessible focus ring at all sizes
        'focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2',
        // keep your desktop sizing/border/etc.
        'xl:h-10 xl:w-full xl:max-w-sm xl:rounded-lg xl:border xl:border-muted xl:py-2 xl:pr-2 xl:pl-3.5 xl:shadow-sm xl:backdrop-blur-md xl:transition-colors xl:duration-200 xl:hover:border-gray-900',
        className
      )}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <Search className="text-muted-foreground agnifying-glass me-2 h-[18px] w-[18px]" />
      )}
      <span
        className={cn(
          'placeholder-text hidden text-sm text-muted-foreground group-hover:text-gray-900 xl:inline-flex',
          placeholderClassName
        )}
      >
        Search your page...
      </span>
      <span
        className="search-command ml-auto hidden items-center text-sm lg:flex lg:rounded-md lg:bg-primary lg:px-1.5 lg:py-1 lg:text-xs lg:font-semibold lg:text-primary-foreground xl:justify-normal">
        <Command strokeWidth={2} className="h-[12px] w-[12px]" />K
      </span>
    </button>
  );
}
