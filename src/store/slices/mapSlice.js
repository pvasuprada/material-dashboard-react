import { createSlice } from "@reduxjs/toolkit";
import { fetchFilteredData } from "store/slices/filterSlice";

const initialState = {
  layers: [],
  data: [],
  extent: {
    xmin: null,
    ymin: null,
    xmax: null,
    ymax: null,
  },
  averages: [
    // { geobin: "8928c204a5bffff", user_count: 1, avg_dl_latency: 3, total_dl_volume: 2 },
    // { geobin: "8928c2059cfffff", user_count: 2, avg_dl_latency: 4, total_dl_volume: 1 },
  ],
  loading: false,
  error: null,
  center: [-93.31223, 32.1341], // Default center coordinates [longitude, latitude]
  zoom: 4, // Default zoom level
  selectedLocation: null, // Add selected location state
  networkGenieLayers: [], // Array to store NetworkGenie layers data
  selectedSites: [], // Add selected sites array
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
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
    addNetworkGenieLayer: (state, action) => {
      const { records, layerName } = action.payload;
      state.networkGenieLayers.push({
        name: layerName,
        records,
        timestamp: new Date().toISOString(),
      });
    },
    clearNetworkGenieLayers: (state) => {
      state.networkGenieLayers = [];
    },
    setSelectedSites: (state, action) => {
      state.selectedSites = action.payload;
    },
    addSelectedSite: (state, action) => {
      if (!state.selectedSites.find((site) => site.nwfid === action.payload.nwfid)) {
        state.selectedSites.push(action.payload);
      }
    },
    removeSelectedSite: (state, action) => {
      state.selectedSites = state.selectedSites.filter((site) => site.nwfid !== action.payload);
    },
    clearSelectedSites: (state) => {
      state.selectedSites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredData.fulfilled, (state, action) => {
        if (action.payload.mapData) {
          state.data = action.payload.mapData.data.data || [];
          state.layers = action.payload.mapData.data.layers || [];
          state.extent = action.payload.mapData.data.extent || state.extent;
          state.averages = action.payload.mapData.data.averages || [];
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFilteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setMapData,
  clearMapData,
  updateMapView,
  setLoading,
  setError,
  setSelectedLocation,
  clearSelectedLocation,
  addNetworkGenieLayer,
  clearNetworkGenieLayers,
  setSelectedSites,
  addSelectedSite,
  removeSelectedSite,
  clearSelectedSites,
} = mapSlice.actions;

// Selectors
export const selectMapData = (state) => state.map.data;
export const selectMapLayers = (state) => state.map.layers;
export const selectMapExtent = (state) => state.map.extent;
export const selectMapAverages = (state) => state.map.averages;
export const selectMapLoading = (state) => state.map.loading;
export const selectMapError = (state) => state.map.error;
export const selectMapCenter = (state) => state.map.center;
export const selectMapZoom = (state) => state.map.zoom;
export const selectSelectedLocation = (state) => state.map.selectedLocation;
export const selectNetworkGenieLayers = (state) => state.map.networkGenieLayers;
export const selectSelectedSites = (state) => state.map.selectedSites;

export default mapSlice.reducer;
