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
  center: [-93.31223, 32.1341], // Default center coordinates [longitude, latitude]
  zoom: 4, // Default zoom level
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapData: (state, action) => {
      state.data = action.payload.data || [];
      state.layers = action.payload.layers || [];
      state.extent = action.payload.extent || state.extent;
      state.averages = action.payload.averages || [];
    },
    clearMapData: (state) => {
      state.data = [];
      state.layers = [];
      state.extent = initialState.extent;
      state.averages = [];
    },
    updateMapView: (state, action) => {
      const { center, zoom } = action.payload;
      if (center) state.center = center;
      if (zoom !== undefined) state.zoom = zoom;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("filter/fetchFilteredData/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("filter/fetchFilteredData/fulfilled", (state, action) => {
        if (action.payload.mapData) {
          state.data = action.payload.mapData.data || [];
          state.layers = action.payload.mapData.layers || [];
          state.extent = action.payload.mapData.extent || state.extent;
          state.averages = action.payload.mapData.averages || [];
        }
        state.loading = false;
        state.error = null;
      })
      .addCase("filter/fetchFilteredData/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setMapData, clearMapData, updateMapView, setLoading, setError } = mapSlice.actions;

// Selectors
export const selectMapData = (state) => state.map.data;
export const selectMapLayers = (state) => state.map.layers;
export const selectMapExtent = (state) => state.map.extent;
export const selectMapAverages = (state) => state.map.averages;
export const selectMapLoading = (state) => state.map.loading;
export const selectMapError = (state) => state.map.error;
export const selectMapCenter = (state) => state.map.center;
export const selectMapZoom = (state) => state.map.zoom;

export default mapSlice.reducer;
