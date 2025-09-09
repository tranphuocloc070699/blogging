import {cn} from "@/lib/utils";
import React from "react";
import SearchNotFoundIcon from "@/components/icons/search-not-found-icon";


interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  image?: React.ReactNode
  text?: string
  description?: string
  textClassName?: string
  descriptionClassName?: string
  imageClassName?: string
  actions?: React.ReactNode
  actionsClassName?: string
}

const EMPTY_STYLES = {
  container: "flex flex-col items-center justify-center  px-6",
  imageWrapper: "mb-6 text-muted-foreground/60",
  defaultImage: "size-16",
  text: "text-base font-medium text-muted-foreground text-center max-w-sm",
  description: "text-sm text-muted-foreground/80 text-center max-w-md mt-2",
  actions: "mt-6 flex flex-col sm:flex-row gap-2",
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
    (
        {
          className,
          image,
          text = "No data available",
          description,
          textClassName,
          descriptionClassName,
          imageClassName,
          actions,
          actionsClassName,
          ...props
        },
        ref
    ) => {
      return (
          <div
              ref={ref}
              className={cn(EMPTY_STYLES.container, className)}
              {...props}
          >
            <div className={cn(EMPTY_STYLES.imageWrapper, imageClassName)}>
              {image || <SearchNotFoundIcon/>}
            </div>

            {text && (
                <p className={cn(EMPTY_STYLES.text, textClassName)}>
                  {text}
                </p>
            )}

            {description && (
                <p className={cn(EMPTY_STYLES.description, descriptionClassName)}>
                  {description}
                </p>
            )}

            {actions && (
                <div className={cn(EMPTY_STYLES.actions, actionsClassName)}>
                  {actions}
                </div>
            )}
          </div>
      )
    })

