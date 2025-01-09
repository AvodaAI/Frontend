"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader, DialogTitle } from "./dialog";

interface ModalProps {
  title: string;
  description: string | React.ReactNode;
  className?:string;
  isOpen: boolean;
  isHeader?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  className,
  isHeader = true,
}) => {
  const onChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={cn(className)}>
      {isHeader && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
