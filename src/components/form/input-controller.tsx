// Type definitions
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

// 1. BASIC INPUT FIELD COMPONENT
// This is a simple reusable input with label and error handling
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  error,
  required = false,
  className,
  id,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}
        >
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        id={id}
        className={cn(
          className,
          error && "border-red-500 focus:ring-red-500"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
InputField.displayName = "InputField";



