import { useState } from "react";
import Basemaps from "./Basemaps";
import LayerList from "./LayerList";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import { useMap } from "../context/MapContext";

const controlsContainerStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  zIndex: 1000,
};

const MapControls = ({
  mapRef,
  onZoomIn,
  onZoomOut,
  onFullscreenToggle,
}) => {
  const [basemapAnchorEl, setBasemapAnchorEl] = useState(null);
  const [layersAnchorEl, setLayersAnchorEl] = useState(null);
  const theme = useTheme();
  const {
    mapInstance,
    basemaps,
    overlayLayers,
    currentBasemap,
    setCurrentBasemap,
    layerVisibility,
    setLayerVisibility,
    selectedMetric,
    setSelectedMetric,
  } = useMap();

  const handleBasemapChange = (basemapKey) => {
    setBasemapAnchorEl(null);
    if (basemapKey && basemapKey !== currentBasemap && mapInstance) {
      mapInstance.getLayers().removeAt(0);
      mapInstance.getLayers().insertAt(0, basemaps[basemapKey]);
      setCurrentBasemap(basemapKey);
    }
  };

  const handleLayerToggle = (layerKey) => {
    const newVisibility = !layerVisibility[layerKey];
    setLayerVisibility((prev) => ({
      ...prev,
      [layerKey]: newVisibility,
    }));
    if (overlayLayers[layerKey]) {
      overlayLayers[layerKey].setVisible(newVisibility);
    }
  };

  const createControlButton = (icon, onClick) => (
    <MDButton
      variant="contained"
      color="white"
      iconOnly
      circular
      size="small"
      onClick={onClick}
      sx={{
        minWidth: "32px",
        width: "32px",
        height: "32px",
        padding: 0,
        boxShadow: theme.shadows[2],
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Icon sx={{ fontSize: 20 }}>{icon}</Icon>
    </MDButton>
  );

  return (
    <MDBox sx={controlsContainerStyle}>
      {createControlButton("add", onZoomIn)}
      {createControlButton("remove", onZoomOut)}
      {createControlButton("map", (e) => setBasemapAnchorEl(e.currentTarget))}
      {createControlButton("layers", (e) => setLayersAnchorEl(e.currentTarget))}
      {createControlButton("fullscreen", onFullscreenToggle)}

      <Basemaps
        container={mapRef.current}
        anchorEl={basemapAnchorEl}
        onClose={() => setBasemapAnchorEl(null)}
        onBasemapChange={handleBasemapChange}
      />

      <LayerList
        container={mapRef.current}
        anchorEl={layersAnchorEl}
        onClose={() => setLayersAnchorEl(null)}
        layerVisibility={layerVisibility}
        onLayerToggle={handleLayerToggle}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />
    </MDBox>
  );
};

export default MapControls; 