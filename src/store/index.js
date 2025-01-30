import dashboardReducer from "./slices/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
import chartReducer from "./slices/chartSlice";
import filterReducer from "./slices/filterSlice";
import mapReducer from "./slices/mapSlice";
import gridDataReducer from "./slices/gridDataSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    charts: chartReducer,
    filter: filterReducer,
    map: mapReducer,
    grid: gridDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["filter/fetchFilteredData/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.dateRange"],
        // Ignore these paths in the state
        ignoredPaths: ["filter.selectedFilters.dateRange"],
      },
    }),
});

export default store;
