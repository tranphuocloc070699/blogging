import * as React from "react"
import {Fragment, useMemo} from "react"
import {cva, VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

const inputVariants = cva(["flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"], {
  variants: {
    withPrefix: {
      true: "pl-10",
      false: null,
    }
  },
  defaultVariants: {
    withPrefix: false
  }
})

const prefixVariants = cva(
    "left-3 absolute top-[50%] -translate-y-1/2"
)

interface InputProps
    extends Omit<React.ComponentProps<"input">, "prefix">,
        VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
                                                                className,
                                                                type,
                                                                ...baseProps
                                                              }, ref) => {
      const {prefix, ...props} = baseProps;
      return (
          <div className={"relative flex-grow"}>
            {
                prefix && <span className={cn(prefixVariants())}>
          {prefix}
        </span>
            }
            <input
                type={type}
                className={cn(
                    inputVariants({
                      withPrefix: Boolean(prefix)
                    }),
                    className
                )}
                ref={ref}
                {...props}
            />
          </div>
      )
    }
)

Input.displayName = "Input"
export {Input}
