import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
    market: "all",
    sector: "all",
    category: "all",
    subCategory: "all",
    brand: "all",
    channel: "all",
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    },
  },
  loading: false,
  error: null,
};

export const fetchFilterOptions = createAsyncThunk("filter/fetchOptions", async () => {
  try {
    const response = await axios.get("/api/filter-options");
    return response.data;
  } catch (error) {
    throw Error(error.response?.data?.message || "Failed to fetch filter options");
  }
});

export const fetchFilteredData = createAsyncThunk(
  "filter/fetchData",
  async (filters = initialState.selectedFilters) => {
    try {
      const response = await axios.post("/api/filtered-data", filters);
      return response.data;
    } catch (error) {
      throw Error(error.response?.data?.message || "Failed to fetch filtered data");
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateSelectedFilters: (state, action) => {
      state.selectedFilters = {
        ...state.selectedFilters,
        ...action.payload,
      };
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
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredData = action.payload;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
