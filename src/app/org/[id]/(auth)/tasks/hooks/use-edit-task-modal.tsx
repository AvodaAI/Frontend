
import { AddEditTaskPayload } from "@/types/task";
import { create } from "zustand";

interface useEditTaskModalStore {
  isOpen: boolean;
  defaultValues: Partial<AddEditTaskPayload> | null;
  onOpen: (defaultValues?: Partial<AddEditTaskPayload> | null) => void;
  onClose: () => void;
}

export const useEditTaskModal = create<useEditTaskModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
