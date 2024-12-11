// src/store/rootReducer.ts

import { combineReducers } from "@reduxjs/toolkit";
import errorReducer from "./slices/errorSlice";
import authReducer from "./slices/authSlice";
// import usersReducer from "./slices/usersSlice";

// API reducers
import authApi from "./apis/authApi";
// import usersApi from "./apis/usersApi";
// import adminApi from "./apis/adminApi";

export interface RootState {
  error: ReturnType<typeof errorReducer>;
  auth: ReturnType<typeof authReducer>;
  // users: ReturnType<typeof usersReducer>;

  // RTK Query API slices
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;
  // [usersApi.reducerPath]: ReturnType<typeof usersApi.reducer>;
  // [adminApi.reducerPath]: ReturnType<typeof adminApi.reducer>;
}

export const rootReducer = combineReducers({
  error: errorReducer,
  auth: authReducer,
  // users: usersReducer,

  // Add RTK Query reducers
  [authApi.reducerPath]: authApi.reducer,
  // [usersApi.reducerPath]: usersApi.reducer,
  // [adminApi.reducerPath]: adminApi.reducer,
});
