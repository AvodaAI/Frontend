
import { AddEditProject } from "@/types/project";
import { create } from "zustand";

interface useEditProjectModalStore {
  isOpen: boolean;
  defaultValues: Partial<AddEditProject> | null;
  onOpen: (defaultValues?: Partial<AddEditProject> | null) => void;
  onClose: () => void;
}

export const useEditProjectModal = create<useEditProjectModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
