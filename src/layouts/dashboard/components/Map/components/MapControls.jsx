import { useState } from "react";
import Basemaps from "./Basemaps";
import LayerList from "./LayerList";

const controlStyle = {
  background: "rgba(255,255,255,0.9)",
  padding: "2px",
  margin: "5px",
  borderRadius: "4px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  border: "none",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const controlsContainerStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const MapControls = ({
  mapRef,
  onZoomIn,
  onZoomOut,
  onBasemapChange,
  onLayerToggle,
  onMetricChange,
  layerVisibility,
  selectedMetric,
  onFullscreenToggle,
}) => {
  const [basemapAnchorEl, setBasemapAnchorEl] = useState(null);
  const [layersAnchorEl, setLayersAnchorEl] = useState(null);

  const createControlButton = (icon, onClick) => (
    <button style={controlStyle} onClick={onClick}>
      <i className="material-icons">{icon}</i>
    </button>
  );

  return (
    <div style={controlsContainerStyle}>
      {createControlButton("add", onZoomIn)}
      {createControlButton("remove", onZoomOut)}
      {createControlButton("map", (e) => setBasemapAnchorEl(e.currentTarget))}
      {createControlButton("layers", (e) => setLayersAnchorEl(e.currentTarget))}
      {createControlButton("fullscreen", onFullscreenToggle)}

      <Basemaps
        container={mapRef.current}
        anchorEl={basemapAnchorEl}
        onClose={() => setBasemapAnchorEl(null)}
        onBasemapChange={onBasemapChange}
      />

      <LayerList
        container={mapRef.current}
        anchorEl={layersAnchorEl}
        onClose={() => setLayersAnchorEl(null)}
        layerVisibility={layerVisibility}
        onLayerToggle={onLayerToggle}
        selectedMetric={selectedMetric}
        onMetricChange={onMetricChange}
      />
    </div>
  );
};

export default MapControls; 