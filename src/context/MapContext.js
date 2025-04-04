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
    network_genie_layer_1: true,
    sites_layer: true,
    raw_coverage: false,
    interpolation: false,
    population: false,
    building: false,
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
