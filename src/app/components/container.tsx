//src/components/container.tsx
//TODO: Fix JSX issues
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function Container({
  children,
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component 
      className={cn(
        "container mx-auto px-4 md:px-[--padding-md]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}