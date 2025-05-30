import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import linkReducer from "../features/links/linkSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    link: linkReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
