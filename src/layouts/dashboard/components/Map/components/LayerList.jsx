import {
  Menu,
  MenuItem,
  Checkbox,
  Radio,
  FormControlLabel,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { useMap } from "../../../../../context/MapContext";
import { useState } from "react";
import Legend from "./Legend";

const LayerList = ({ container, anchorEl, onClose, onLayerToggle, onMetricChange }) => {
  const { layerVisibility, selectedMetric, mapInstance, overlayLayers } = useMap();
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
      ],
    },
    {
      title: "UG Layers",
      layers: [
        //{ id: "coverage_capacity", label: "Coverage Capacity" },
        { id: "user_count", label: "User Count" },
        { id: "avg_dl_latency", label: "Avg Download Latency" },
        { id: "total_dl_volume", label: "Total Download Volume" },
        { id: "avg_nr_dl_colume_share", label: "Avg NR DL Volume Share" },
        { id: "avg_nr_rsrp", label: "Avg NR RSRP" },
        { id: "avg_nr_ul_volume_share", label: "Avg NR UL Volume Share" },
        { id: "dl_connections_count", label: "DL Connections Count" },
        { id: "p10_dl_speed", label: "P10 DL Speed" },
        { id: "p10_ul_speed", label: "P10 UL Speed" },
        { id: "p50_dl_speed", label: "P50 DL Speed" },
        { id: "p50_ul_speed", label: "P50 UL Speed" },
        { id: "total_ul_volume", label: "Total UL Volume" },
        { id: "ul_connections_count", label: "UL Connections Count" },
      ],
    },
  ];

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

          {group.type === "radio"
            ? // Render radio options for metrics
              group.options.map((option) => (
                <MenuItem key={option.id}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedMetric === option.id}
                        onChange={() => onMetricChange(option.id)}
                      />
                    }
                    label={option.label}
                  />
                </MenuItem>
              ))
            : // Render checkboxes for layers
              group.layers.map((layer) => (
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
                          checked={layerVisibility[layer.id]}
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
