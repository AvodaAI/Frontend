import { NewUser } from "@/types";
import { create } from "zustand";

interface useEditUserModalStore {
  isOpen: boolean;
  defaultValues: Partial<NewUser> | null;
  onOpen: (defaultValues?: Partial<NewUser> | null) => void;
  onClose: () => void;
}

export const useEditUserModal = create<useEditUserModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
