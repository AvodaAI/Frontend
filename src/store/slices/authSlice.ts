// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { RootState } from "../rootReducer";

interface AuthState {
  user: User | null;
  token: string | null; // Token can be null
  status: "idle" | "authenticated" | "unauthenticated" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

interface SetCredentialsPayload {
  user: User;
  token: string | null; // Token can be string or null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // Can be null
      state.status = "authenticated";
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = "unauthenticated";
      state.error = null;
    },
    setAuthStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = "failed";
      }
    },
  },
});

export const { setCredentials, clearCredentials, setAuthStatus, setAuthError } = authSlice.actions;

// **Export the selector**
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;