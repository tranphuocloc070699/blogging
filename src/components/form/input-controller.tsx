// Type definitions
import {forwardRef} from "react";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Control, Controller, FieldValues, Path, RegisterOptions} from "react-hook-form";

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


interface ControlledInputFieldProps<TFieldValues extends FieldValues>
    extends Omit<InputFieldProps, 'name' | 'id'> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}

function ControlledInputField<TFieldValues extends FieldValues>({
                                                                  name,
                                                                  control,
                                                                  rules = {},
                                                                  ...inputProps
                                                                }: ControlledInputFieldProps<TFieldValues>) {
  return (
      <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field, fieldState: {error}}) => (
              <InputField
                  {...field} // Spreads: value, onChange, onBlur, name, ref
                  {...inputProps} // Spreads: label, placeholder, type, etc.
                  id={name}            // Uses field name as ID for accessibility
                  error={error?.message} // Passes validation error message
              />
          )}
      />
  );
}


