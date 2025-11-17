import React from "react";
import {cn} from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function PageHeader({
                                     title,
                                     breadcrumb,
                                     children,
                                     className,
                                   }: React.PropsWithChildren<PageHeaderTypes>) {
  return (
      <header className={cn('mb-6 @container xs:-mt-2 lg:mb-7', className)}>
        <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
          <div>


            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                    <React.Fragment key={item.name}>
                      <BreadcrumbItem>
                        {item.href ? (
                            <BreadcrumbLink href={item.href}>
                              {item.name}
                            </BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && <BreadcrumbSeparator/>}
                    </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <h2
                className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px] font-bold mt-4"
            >
              {title}
            </h2>
          </div>
          {children}
        </div>
      </header>
  );
}
