import { createSlice } from "@reduxjs/toolkit";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { dashboardData } from "layouts/dashboard/data/dashboardData";

const initialState = {
  reportsBar: reportsBarChartData,
  reportsLine: reportsLineChartData,
  statistics: dashboardData.statistics,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateReportsBar: (state, action) => {
      state.reportsBar = action.payload;
    },
    updateReportsLine: (state, action) => {
      state.reportsLine = action.payload;
    },
    updateStatistics: (state, action) => {
      state.statistics = action.payload;
    },
  },
});

export const { updateReportsBar, updateReportsLine, updateStatistics } = dashboardSlice.actions;
export default dashboardSlice.reducer;
