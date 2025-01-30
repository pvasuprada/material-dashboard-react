import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredData } from "./filterSlice";

const initialState = {
  chartData: [],
  xData: [],
  loading: false,
  error: null,
};

const chartSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload.chartData.chartData || [];
        state.xData = action.payload.chartData.xData || [];
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.chartData = [];
        state.xData = [];
      });
  },
});

export default chartSlice.reducer;
