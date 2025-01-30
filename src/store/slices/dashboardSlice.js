import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredData } from "./filterSlice";

const initialState = {
  statistics: [],
  loading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.statistics || [];
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statistics = [];
      });
  },
});

export const { updateReportsBar, updateReportsLine, updateStatistics } = dashboardSlice.actions;
export default dashboardSlice.reducer;
