import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "services/api";

// Async thunks
export const fetchInitialOptions = createAsyncThunk(
  "filter/fetchInitialOptions",
  async (_, { rejectWithValue }) => {
    try {
      const [markets, gnodebs] = await Promise.all([
        api.getMarkets(),
        api.getGnodebs()
      ]);

      // Process markets data
      const processedMarkets = markets.data.map(m => ({
        text: m.market_text,
        value: m.market
      }));

      // Process gnodebs data - filter unique by label
      const uniqueGnodebs = Array.from(
        new Map(gnodebs.data.map(item => [item.label, item])).values()
      ).map(g => ({
        label: g.label,
        value: g.value,
        market_id: g.market_id,
        gnb_str: g.gnb_str
      }));

      return {
        markets: processedMarkets,
        gnodebs: uniqueGnodebs
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch initial options");
    }
  }
);

export const fetchSectors = createAsyncThunk(
  "filter/fetchSectors",
  async (gnodebData, { rejectWithValue }) => {
    try {
      const [nwfid, du] = gnodebData.gnb_str.split("-");
      const response = await api.getSectors({
        nwfid,
        du: parseInt(du),
        trafficType: ["FWA"]
      });
      
      return response.data.map(s => ({
        value: s.sector,
        label: `Sector ${s.sector}`
      }));
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch sectors");
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
          gnodeb: filters.gnodeb,
          sector: filters.sector,
          traffic_type: filters.trafficType,
          date_range: `${startDate};${endDate}`,
        }),
        api.getStatistics({
          market_id: filters.market,
          gnodeb: filters.gnodeb,
          sector: filters.sector,
          traffic_type: filters.trafficType,
          date_range: `${startDate};${endDate}`,
        }),
        api.getMapData({
          market_id: filters.market,
          gnodeb: filters.gnodeb,
          sector: filters.sector,
          traffic_type: filters.trafficType,
          date_range: `${startDate};${endDate}`,
        }),
        api.getSiteData({
          market_id: filters.market,
          gnodeb: filters.gnodeb,
          sector: filters.sector,
          traffic_type: filters.trafficType,
          date_range: `${startDate};${endDate}`,
        }),
      ]);

      return {
        chartData: {
          chartData: chartData.chartData,
          xData: chartData.xData,
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

const TRAFFIC_TYPES = ["132.0", "8.0", "9.0", "FWA"];

const initialState = {
  data: {
    markets: [],
    gnodebs: [],
    sectors: [],
    trafficTypes: TRAFFIC_TYPES,
  },
  selectedFilters: {
    market: null,
    gnodeb: null,
    sector: null,
    trafficType: "FWA",
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
      // Check if gnodeb has changed
      const gnodebChanged = state.selectedFilters.gnodeb?.value !== action.payload.gnodeb?.value;
      
      // Update filters
      state.selectedFilters = action.payload;
      
      // Clear sectors if gnodeb changed
      if (gnodebChanged) {
        state.data.sectors = [];
        state.selectedFilters.sector = null;
      }
    },
    resetFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
      state.data.sectors = []; // Also clear sectors data on reset
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSectors: (state, action) => {
      state.data.sectors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data.markets = action.payload.markets;
        state.data.gnodebs = action.payload.gnodebs;
        state.error = null;
      })
      .addCase(fetchInitialOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch initial options";
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.data.sectors = action.payload;
        state.error = null;
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchFilteredData.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedFilters, resetFilters, setLoading, setSectors } = filterSlice.actions;
export default filterSlice.reducer;
