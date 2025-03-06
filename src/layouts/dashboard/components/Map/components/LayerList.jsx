import { Menu, MenuItem, Checkbox, Radio, FormControlLabel, Divider, Typography, IconButton } from "@mui/material";
import Icon from "@mui/material/Icon";
import { useMap } from "../context/MapContext";

const LayerList = ({ container, anchorEl, onClose, onLayerToggle, onMetricChange }) => {
  const { layerVisibility, selectedMetric, mapInstance, overlayLayers } = useMap();

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
          duration: 1000
        });
      }
    }
    // For WMS layers
    else if (source.getImageExtent) {
      const extent = source.getImageExtent();
      if (extent) {
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000
        });
      }
    }
  };

  const layerGroups = [
    {
      title: "Base Layers",
      layers: [
        { id: "geoserver", label: "GeoServer Layer" },
        { id: "hurricanes", label: "Hurricanes" },
        { id: "hexbins", label: "Hexbins" },
        { id: "coverage_capacity", label: "Coverage Capacity (Brown)" },
      ],
    },
    {
      title: "Metrics",
      type: "radio",
      options: [
        { id: "user_count", label: "User Count (Red)" },
        { id: "avg_dl_latency", label: "Avg Download Latency (Blue)" },
        { id: "total_dl_volume", label: "Total Download Volume (Pink)" },
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
          
          {group.type === "radio" ? (
            // Render radio options for metrics
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
          ) : (
            // Render checkboxes for layers
            group.layers.map((layer) => (
              <MenuItem key={layer.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={layerVisibility[layer.id]}
                      onChange={() => onLayerToggle(layer.id)}
                    />
                  }
                  label={layer.label}
                />
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
              </MenuItem>
            ))
          )}
        </div>
      ))}
    </Menu>
  );
};

export default LayerList; 