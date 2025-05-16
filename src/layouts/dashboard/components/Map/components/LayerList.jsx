import { fromLonLat } from "ol/proj";
import { useState } from "react";

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

import { useMap } from "../../../../../context/MapContext";
import { metricConfigs } from "../config/layers";
import Legend from "./Legend";

// Layer group definitions
const LAYER_GROUPS = {
  BASE: "Base Layers",
  COVERAGE: "Coverage & Infrastructure",
  UG: "UG Layers",
  TRUECALL: "Truecall Layers",
};

const LayerList = ({ container, anchorEl, onClose, onLayerToggle }) => {
  const { layerVisibility, mapInstance, overlayLayers, addedLayers } = useMap();
  const [expandedLegends, setExpandedLegends] = useState({});

  const handleZoomToLayer = (layerId) => {
    if (!mapInstance || !overlayLayers[layerId]) return;

    const layer = overlayLayers[layerId];
    const source = layer.getSource();

    if (!source) return;

    if (source.getFeatures) {
      // Vector layers
      const features = source.getFeatures();
      if (features.length > 0) {
        const extent = source.getExtent();
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      }
    } else {
      // WMS layers
      const layerExtent = layer.getProperties().extent;
      if (layerExtent) {
        const { minX, minY, maxX, maxY } = layerExtent;
        const extent = [...fromLonLat([minX, minY]), ...fromLonLat([maxX, maxY])];
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      } else {
        const view = mapInstance.getView();
        view.animate({
          zoom: Math.max(view.getZoom() - 0.5, 0),
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

  // Get layers by category
  const getLayersByCategory = (category) => {
    return Object.entries(metricConfigs || {})
      .filter(([id, config]) => addedLayers.has(id) && config.category === category)
      .map(([id, config]) => ({
        id,
        label: config.label,
      }));
  };

  // Get coverage and infrastructure layers
  const getCoverageAndInfraLayers = () => {
    const layers = [
      { id: "raw_coverage", label: "Raw Coverage", category: "coverage" },
      { id: "interpolation", label: "Interpolation", category: "coverage" },
      { id: "building", label: "Building Layer", category: "infrastructure" },
      { id: "population_wms", label: "Population WMS Layer", category: "demographics" },
    ];
    return layers.filter((layer) => addedLayers.has(layer.id));
  };

  // Build layer groups
  const buildLayerGroups = () => {
    const groups = [
      {
        title: LAYER_GROUPS.BASE,
        layers: [
          { id: "network_genie_layer_1", label: "Network Genie Layer 1" },
          { id: "sites_layer", label: "Sites Layer" },
        ],
      },
    ];

    const coverageLayers = getCoverageAndInfraLayers();
    if (coverageLayers.length > 0) {
      groups.push({
        title: LAYER_GROUPS.COVERAGE,
        layers: coverageLayers,
      });
    }

    const ugLayers = getLayersByCategory("ug");
    if (ugLayers.length > 0) {
      groups.push({
        title: LAYER_GROUPS.UG,
        layers: ugLayers,
      });
    }

    const truecallLayers = getLayersByCategory("truecall");
    if (truecallLayers.length > 0) {
      groups.push({
        title: LAYER_GROUPS.TRUECALL,
        layers: truecallLayers,
      });
    }

    return groups;
  };

  const layerGroups = buildLayerGroups();

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
