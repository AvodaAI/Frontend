import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { icon?: React.ReactNode }>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            icon ? 'pl-10' : 'px-3',
          )}
          ref={ref}
          {...props}
        />
        {icon && <span className="absolute flex items-center left-3 top-1/2 transform -translate-y-1/2">{icon}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
