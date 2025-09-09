import React from 'react';
import {cn} from "@/lib/utils";

export default function DrawerBlock({
                                      title,
                                      children,
                                      className,
                                    }: React.PropsWithChildren<{
  title: string;
  className?: string
}>) {
  return (
      <div className={cn('mb-10 px-0.5', className)}>
        <h6
        >
          {title}
        </h6>
        {children}
      </div>
  );
}