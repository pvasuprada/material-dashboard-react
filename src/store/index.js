import dashboardReducer from "./slices/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
import chartReducer from "./slices/chartSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    charts: chartReducer,
  },
});
