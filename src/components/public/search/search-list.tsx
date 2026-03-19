'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { pageLinks } from "@/config/data"
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { ScrollText, Search, X } from "lucide-react";
import { useModal } from "@/components/modal-views/use-modal";


export default function SearchList() {
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [menuItemsFiltered, setMenuItemsFiltered] = useState(pageLinks);
  const { closeModal } = useModal();

  useEffect(() => {
    if (searchText.length > 0) {
      const searchResult = pageLinks.filter((item: any) => {
        const label = item.name;
        return (
          label.match(searchText.toLowerCase()) ||
          (label.toLowerCase().match(searchText.toLowerCase()) && label)
        );
      })
      setMenuItemsFiltered(searchResult)
    } else {
      setMenuItemsFiltered(pageLinks);
    }
  }, [searchText]);

  useEffect(() => {
    if (inputRef?.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
    return () => {
      inputRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center px-5 py-4 gap-4">
        <div className='flex-1'>
          <Input
            value={searchText}
            ref={inputRef}
            onChange={(e) => setSearchText(() => e.target.value)}
            placeholder="Search pages here"
            className="flex-1 bg-gray-200 dark:bg-gray-500/10 border-none ring-0 shadow-none h-10"
            prefix={<Search className={"h-[18px] w-auto"} />}

          />
        </div>
        <X className={"w-5 h-5 cursor-pointer"} onClick={closeModal} />
      </div>
      <div
        className="custom-scrollbar max-h-[60vh] overflow-y-auto border-t border-gray-300 dark:border-muted  px-2 py-4">
        <>
          {menuItemsFiltered.length === 0 ? (
            <Empty
              className="scale-75"
              text="No Result Found"
              textClassName="text-xl"
            />
          ) : null}
        </>

        {menuItemsFiltered.map((item, index) => {
          return (
            <Fragment key={item.name + '-' + index}>
              {item?.href ? (
                <Link
                  href={item?.href as string}
                  className="relative my-0.5 flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-muted/50  focus:outline-none focus-visible:bg-gray-100"
                >
                  <span
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500">
                    <ScrollText className={"h-5 w-5 text-muted-foreground"} />
                  </span>

                  <span className="ms-3 grid gap-0.5">
                    <span className="font-medium capitalize text-gray-900 dark:text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item?.href as string}
                    </span>
                  </span>
                </Link>
              ) : (
                <h6
                  className={cn(
                    'mb-1 px-3 text-xs font-semibold uppercase text-left tracking-widest text-muted-foreground',
                    index !== 0 && 'mt-6 4xl:mt-7'
                  )}
                >
                  {item.name}
                </h6>
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
