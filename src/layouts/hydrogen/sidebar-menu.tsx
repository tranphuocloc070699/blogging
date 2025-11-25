"use client"


import React, {Fragment, useState} from 'react';

import {usePathname} from 'next/navigation';
import {menuItems} from './menu-items';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {cn} from "@/lib/utils";
import Link from 'next/link';
import {ChevronDown} from "lucide-react";

const SidebarMenu = () => {
  const pathname = usePathname();

  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (path?: string) => {
    if (!path) return;
    setOpenItems((prev) =>
        prev.includes(path)
            ? prev.filter((p) => p !== path) // remove
            : [...prev, path] // add
    )
  }
  return (
      <div className="mt-4 pb-3 3xl:mt-6">
        {menuItems.map((item, index) => {
          let isOpen = false;
          if (item?.href != null) {
            isOpen = openItems.includes(item?.href)
          }

          const isActive = pathname === (item?.href as string);
          const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
              (dropdownItem) => dropdownItem.href === pathname
          );
          const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

          return (
              <Fragment key={item.name + '-' + index}>
                {item?.href ? (
                    <>
                      {item?.dropdownItems ?
                          <Collapsible
                              key={item.href}
                              open={isOpen}
                              onOpenChange={() => toggleItem(item.href)}
                          >
                            <CollapsibleTrigger className={"w-full"}>
                              <div
                                  className={cn(
                                      'group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2',
                                      isDropdownOpen
                                          ? 'text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5'
                                          : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700'
                                  )}
                              >
                        <span className="flex items-center text-sm">
                          {item?.icon && (
                              <span
                                  className={cn(
                                      'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                      isDropdownOpen
                                          ? 'text-primary'
                                          : 'text-gray-800 dark:text-muted dark:group-hover:text-gray-700'
                                  )}
                              >
                              {item?.icon}
                            </span>
                          )}
                          {item.name}
                        </span>

                                <ChevronDown
                                    strokeWidth={3}
                                    className={cn(
                                        'h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ',
                                        isOpen && '-rotate-180 '
                                    )}
                                />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                                className={cn("overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down")}>
                              {item?.dropdownItems?.map((dropdownItem, index) => {
                                const isChildActive =
                                    pathname === (dropdownItem?.href as string);

                                return (
                                    <Link
                                        href={dropdownItem?.href}
                                        key={dropdownItem?.name + index}
                                        className={cn(
                                            'mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5 text-sm',
                                            isChildActive
                                                ? 'text-primary'
                                                : 'text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900'
                                        )}
                                    >
                                      <div className="flex items-center truncate">
                            <span
                                className={cn(
                                    'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                    isChildActive
                                        ? 'bg-primary ring-[1px] ring-primary'
                                        : 'opacity-40'
                                )}
                            />{' '}
                                        <span className="truncate text-sm">
                              {dropdownItem?.name}
                            </span>
                                      </div>
                                    </Link>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                          :
                          <Link
                              href={item?.href}
                              className={cn(
                                  'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
                                  isActive
                                      ? 'text-primary before:absolute  before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5'
                                      : 'text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90'
                              )}
                          >
                            <div className="flex items-center truncate">
                              {item?.icon && (
                                  <span
                                      className={cn(
                                          'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                          isActive
                                              ? 'text-primary'
                                              : 'text-gray-800 dark:text-muted dark:group-hover:text-gray-700'
                                      )}
                                  >
                          {item?.icon}
                        </span>
                              )}
                              <span className="truncate text-sm">{item.name}</span>
                            </div>
                          </Link>}
                    </>
                ) : (
                    <h6
                        className={cn(
                            'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest 2xl:px-8',
                            index !== 0 && 'mt-6 3xl:mt-7'
                        )}
                    >
                      {item.name}
                    </h6>
                )}
              </Fragment>
          );
        })}
      </div>
  );
};

export default SidebarMenu;