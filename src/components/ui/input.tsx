import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"

const inputVariants = cva(["flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"], {
  variants: {
    withPrefix: {
      true: "pl-10",
      false: null,
    },
    error: {
      true: "border-red-500 focus:ring-red-500",
      false: null,
    }
  },
  defaultVariants: {
    withPrefix: false,
    error: false
  }
})

const prefixVariants = cva(
  "left-3 absolute top-[50%] -translate-y-1/2"
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, "prefix">,
  Omit<VariantProps<typeof inputVariants>, 'error'> {
  prefix?: React.ReactNode;
  label?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  label,
  error,
  ...baseProps
}, ref) => {
  const { prefix, ...props } = baseProps;
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
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
              withPrefix: Boolean(prefix),
              error: hasError
            }),
            className
          )}
          ref={ref}
          onPointerDown={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-0 leading-4 font-medium">{error}</p>
      )}
    </div>
  )
}
)

Input.displayName = "Input"
export { Input }
