import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [],
  data: [],
  extent: {
    xmin: -124.708281,
    ymin: 46.665252,
    xmax: -121.432472,
    ymax: 48.992177,
  },
  averages: [
    { geobin: "8928c204a5bffff", user_count: 1 },
    { geobin: "8928c2059cfffff", user_count: 2 },
    { geobin: "8928c241ad7ffff", user_count: 3 },
  ],
  loading: false,
  error: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapData: (state, action) => {
      state.data = action.payload;
    },
    clearMapData: (state) => {
      state.data = [];
      state.layers = [];
      state.extent = null;
      state.averages = [];
    },
  },
});

export const { setMapData, clearMapData } = mapSlice.actions;

// Selectors
export const selectMapData = (state) => state.map.data;
export const selectMapLayers = (state) => state.map.layers;
export const selectMapExtent = (state) => state.map.extent;
export const selectMapAverages = (state) => state.map.averages;
export const selectMapLoading = (state) => state.map.loading;
export const selectMapError = (state) => state.map.error;

export default mapSlice.reducer;
