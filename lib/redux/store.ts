import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSetup } from "@/lib/apis/api-setup";
import authSlice from "@/lib/redux/slice/auth.slice";
import sidebarSlice from "@/lib/redux/slice/sidebar.slice";
import settingsSlice from "@/lib/redux/slice/settings.slice";

// Configure the store
export const store = configureStore({
  reducer: {
    [apiSetup.reducerPath]: apiSetup.reducer,
    authSlice,
    sidebarSlice,
    settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSetup.middleware),
});

// Setup listeners for query subscriptions
setupListeners(store.dispatch);

// Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
