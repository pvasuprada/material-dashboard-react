import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api"; // Add this import assuming this is the correct path

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
  async (filters, { rejectWithValue }) => {
    try {
      // Simulating API call
      // Replace this with actual API call:
      // const response = await fetch("/api/filtered-data", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(filters),
      // });
      // return response.json();

      return { success: true, filters };
    } catch (error) {
      return rejectWithValue("Failed to fetch filtered data");
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
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch filtered data";
      });
  },
});

export const { updateSelectedFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
