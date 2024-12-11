// components/layout/section.tsx
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section 
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}