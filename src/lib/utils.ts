// src/lib/utils.ts
import { Users } from "@/types/task";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const passwordRegex = {
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~])/,
  message:
    "Password must contain one lowercase letter, one uppercase letter, one number, and one special character",
};

export const getLocalStorageUsers = () => {
  const rawUsers = localStorage.getItem("users");
  let users: Users[] = [];

  if (rawUsers) {
    try {
      const parsed = JSON.parse(rawUsers);
      if (Array.isArray(parsed)) {
        users = parsed as Users[];
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage:", error);
    }
  }
  return users;
};
