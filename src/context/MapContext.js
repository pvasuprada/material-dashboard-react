import { createContext, useContext, useState } from "react";

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [basemaps, setBasemaps] = useState(null);
  const [overlayLayers, setOverlayLayers] = useState(null);
  const [currentBasemap, setCurrentBasemap] = useState("light");
  const [addedLayers, setAddedLayers] = useState(new Set());
  const [layerVisibility, setLayerVisibility] = useState({
    hurricanes: false,
    geoserver: false,
    network_genie_layer_1: true,
    sites_layer: true,
    raw_coverage: false,
    interpolation: false,
    population: false,
    building: false,
    rec_cnt: false,
    erab_drop_pct: false,
    volte_erab_drop_pct: false,
    vendor: false,
    vendors: false,
    rsrq_db_avg: false,
  });
  const [selectedMetric, setSelectedMetric] = useState(null);

  const value = {
    mapInstance,
    setMapInstance,
    basemaps,
    setBasemaps,
    overlayLayers,
    setOverlayLayers,
    currentBasemap,
    setCurrentBasemap,
    addedLayers,
    setAddedLayers,
    layerVisibility,
    setLayerVisibility,
    selectedMetric,
    setSelectedMetric,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === null) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};

export default MapContext;
