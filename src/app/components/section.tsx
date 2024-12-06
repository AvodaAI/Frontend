// components/layout/section.tsx
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section 
      className={cn(
        "w-full py-12 md:py-24 lg:py-32",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}