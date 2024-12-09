// src/store/index.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { rootReducer, RootState } from "./rootReducer";
import persistConfig from "./persistConfig";

// Import API slices
import authApi from "./apis/authApi";
// import usersApi from "./apis/usersApi";
// import adminApi from "./apis/adminApi";

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(
        authApi.middleware,
        // usersApi.middleware,
        // adminApi.middleware
      ),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Exporting types for usage in components and hooks
export type AppState = RootState;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
