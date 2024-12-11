import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      errorMessage,
      "aria-describedby": ariaDescribedby,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();
    const errorId = `${id}-error`;

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={cn(errorMessage && errorId, ariaDescribedby)}
          {...props}
        />

        {error && errorMessage && (
          <p id={errorId} className="mt-1 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
