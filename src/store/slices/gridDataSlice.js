import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredData } from "store/slices/filterSlice";

const initialState = {
  gridData: [],
  loading: false,
  error: null,
  gridConfig: {
    pageSize: 10,
    currentPage: 1,
    sortField: null,
    sortDirection: null,
  },
};

const gridDataSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    updateGridConfig: (state, action) => {
      state.gridConfig = { ...state.gridConfig, ...action.payload };
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
        state.gridData = action.payload.siteData || [];
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.gridData = [];
      });
  },
});

export const { updateGridConfig } = gridDataSlice.actions;
export default gridDataSlice.reducer;
