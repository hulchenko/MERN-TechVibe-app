import { configureStore } from "@reduxjs/toolkit";
import apiSliceReducer, { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import modalSliceReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    api: apiSliceReducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
    modal: modalSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), // a must configuration for RTK query
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
