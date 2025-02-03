import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "services/api";
// Mock data - replace with actual API calls later
const mockFilterOptions = {
  markets: ["1", "2", "3", "4", "5", "6", "7", "8"],
  sectors: ["115", "116", "117", "118"],
};

// Async thunks
export const fetchFilterOptions = createAsyncThunk(
  "filter/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch both markets and sectors in parallel
      const [markets, sectors] = await Promise.all([api.getMarkets(), api.getSectors()]);

      return {
        markets: markets.markets.map((market) => market.toString()),
        sectors: sectors.data.map((sector) => sector.toString()),
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch filter options");
    }
  }
);

export const fetchFilteredData = createAsyncThunk(
  "filter/fetchData",
  async (filters, { dispatch }) => {
    dispatch(setLoading(true));

    try {
      const startDate = filters.dateRange.startDate.toISOString().split("T")[0];
      const endDate = filters.dateRange.endDate.toISOString().split("T")[0];

      const [chartData, statisticsData, mapData, siteData] = await Promise.all([
        api.getChartData({
          market_id: filters.market,
          sect_id: filters.sector,
          date_range: `${startDate};${endDate}`,
        }),
        api.getStatistics({
          market_id: filters.market,
          sect_id: filters.sector,
          date_range: `${startDate};${endDate}`,
        }),
        api.getMapData({
          market_id: filters.market,
          sect_id: filters.sector,
          date_range: `${startDate};${endDate}`,
        }),
        api.getSiteData({
          market_id: filters.market,
          sect_id: filters.sector,
          date_range: `${startDate};${endDate}`,
        }),
      ]);

      // Structure the response to match what chartSlice expects
      return {
        chartData: {
          chartData: chartData.chartData, // y-axis data array
          xData: chartData.xData, // x-axis data array
        },
        statistics: statisticsData.statistics,
        mapData: mapData,
        siteData: siteData,
      };
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const initialState = {
  data: {
    markets: [],
    sectors: [],
    categories: [],
    subCategories: [],
    brands: [],
    channels: [],
  },
  selectedFilters: {
    market: "All",
    sector: "All",
    category: "All",
    subCategory: "All",
    brand: "All",
    channel: "All",
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    },
  },
  loading: false,
  error: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateSelectedFilters: (state, action) => {
      state.selectedFilters = action.payload;
    },
    resetFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch filter options";
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedFilters, resetFilters, setLoading } = filterSlice.actions;
export default filterSlice.reducer;
