import { configureStore } from "@reduxjs/toolkit";

import chartReducer from "store/slices/chartSlice";
import dashboardReducer from "store/slices/dashboardSlice";
import filterReducer from "store/slices/filterSlice";
import gridDataReducer from "store/slices/gridDataSlice";
import mapReducer from "store/slices/mapSlice";

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
