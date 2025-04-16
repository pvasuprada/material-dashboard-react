import {
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { useState } from "react";

import { useMap } from "../../../../../context/MapContext";
import { metricConfigs } from "../config/layers";
import Legend from "./Legend";

const LayerList = ({ container, anchorEl, onClose, onLayerToggle }) => {
  const { layerVisibility, mapInstance, overlayLayers, addedLayers } = useMap();
  const [expandedLegends, setExpandedLegends] = useState({});

  const handleZoomToLayer = (layerId) => {
    if (!mapInstance || !overlayLayers[layerId]) return;

    const layer = overlayLayers[layerId];
    const source = layer.getSource();

    if (!source) return;

    // For vector layers
    if (source.getFeatures) {
      const features = source.getFeatures();
      if (features.length > 0) {
        const extent = source.getExtent();
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      }
    }
    // For WMS layers
    else if (source.getImageExtent) {
      const extent = source.getImageExtent();
      if (extent) {
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      }
    }
  };

  const toggleLegend = (layerId) => {
    setExpandedLegends((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  // Get the list of UG layers that have been added
  const addedUGLayers = metricConfigs
    ? Object.entries(metricConfigs)
        .filter(([id, config]) => addedLayers.has(id) && config.category !== "truecall") // Filter out truecall layers
        .map(([id, config]) => ({
          id,
          label: config.label,
        }))
    : [];

  // Get the list of added Truecall layers
  const addedTruecallLayers = metricConfigs
    ? Object.entries(metricConfigs)
        .filter(([id, config]) => addedLayers.has(id) && config.category === "truecall")
        .map(([id, config]) => ({
          id,
          label: config.label,
        }))
    : [];

  const layerGroups = [
    {
      title: "Base Layers",
      layers: [
        { id: "geoserver", label: "GeoServer Layer" },
        { id: "hurricanes", label: "Hurricanes" },
        { id: "network_genie_layer_1", label: "Network Genie Layer 1" },
        { id: "sites_layer", label: "Sites Layer" },
        { id: "raw_coverage", label: "Raw Coverage" },
        { id: "interpolation", label: "Interpolation" },
        { id: "population", label: "Population Layer" },
        { id: "building", label: "Building Layer" },
      ],
    },
  ];

  // Only add UG Layers group if there are added layers
  if (addedUGLayers.length > 0) {
    layerGroups.push({
      title: "UG Layers",
      layers: addedUGLayers,
    });
  }

  // Add Truecall Layers group if there are added truecall layers
  if (addedTruecallLayers.length > 0) {
    layerGroups.push({
      title: "Truecall Layers",
      layers: addedTruecallLayers,
    });
  }

  return (
    <Menu
      container={container}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      style={{ zIndex: 2000 }}
    >
      {layerGroups.map((group, groupIndex) => (
        <div key={group.title}>
          {groupIndex > 0 && <Divider />}
          <MenuItem>
            <Typography variant="subtitle2" color="textSecondary">
              {group.title}
            </Typography>
          </MenuItem>

          {group.layers.map((layer) => (
            <div key={layer.id}>
              <MenuItem
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={layerVisibility[layer.id] || false}
                      onChange={() => onLayerToggle(layer.id)}
                    />
                  }
                  label={layer.label}
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLegend(layer.id);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    <Icon>{expandedLegends[layer.id] ? "expand_less" : "expand_more"}</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomToLayer(layer.id);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    <Icon>zoom_in</Icon>
                  </IconButton>
                </div>
              </MenuItem>
              <Legend layer={layer} expanded={expandedLegends[layer.id]} />
            </div>
          ))}
        </div>
      ))}
    </Menu>
  );
};

export default LayerList;
