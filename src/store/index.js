import dashboardReducer from "./slices/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
