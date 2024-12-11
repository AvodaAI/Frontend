import React from 'react';
import { cn } from "@/lib/utils";

interface Props {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

const Container: React.FC<Props> = ({ as: Comp = 'div', className, children }) => {
  return (
    <Comp
      className={cn(
        "container mx-auto px-4 sm:px-6 md:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </Comp>
  );
};

export default Container;

