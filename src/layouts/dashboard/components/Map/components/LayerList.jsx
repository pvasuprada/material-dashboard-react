import { Menu, MenuItem, Checkbox, Radio, FormControlLabel, Divider, Typography } from "@mui/material";
import { layerGroups } from "../config/layers";

const LayerList = ({
  anchorEl,
  onClose,
  layerVisibility,
  onLayerToggle,
  selectedMetric,
  onMetricChange,
  container,
}) => {
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
              <MenuItem key={layer.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={layerVisibility[layer.id]}
                      onChange={() => onLayerToggle(layer.id)}
                    />
                  }
                  label={layer.label}
                />
              </MenuItem>
            ))
          )}
        </div>
      ))}
    </Menu>
  );
};

export default LayerList; 