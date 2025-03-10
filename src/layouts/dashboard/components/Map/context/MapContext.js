import { createContext, useContext, useState } from "react";

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [basemaps, setBasemaps] = useState(null);
  const [overlayLayers, setOverlayLayers] = useState(null);
  const [currentBasemap, setCurrentBasemap] = useState("light");
  const [layerVisibility, setLayerVisibility] = useState({
    hurricanes: false,
    geoserver: false,
    user_count: true,
    avg_dl_latency: false,
    total_dl_volume: false,
    coverage_capacity: false,
  });
  const [selectedMetric, setSelectedMetric] = useState("user_count");

  const value = {
    mapInstance,
    setMapInstance,
    basemaps,
    setBasemaps,
    overlayLayers,
    setOverlayLayers,
    currentBasemap,
    setCurrentBasemap,
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