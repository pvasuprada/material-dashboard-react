import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "services/api";

export const fetchChartData = createAsyncThunk("charts/fetchChartData", async (params) => {
  const response = await api.getChartData(params);
  return response;
});

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
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload.chartData;
        state.xData = action.payload.xData;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default chartSlice.reducer;
