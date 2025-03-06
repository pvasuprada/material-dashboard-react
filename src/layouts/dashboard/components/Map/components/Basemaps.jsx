import { Menu, MenuItem } from "@mui/material";
import { basemapOptions } from "../config/basemaps";

const Basemaps = ({ anchorEl, onClose, onBasemapChange, container }) => {
  const handleBasemapChange = (basemapKey) => {
    onBasemapChange(basemapKey);
    onClose();
  };

  return (
    <Menu
      container={container}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      style={{ zIndex: 2000 }}
    >
      {basemapOptions.map((basemap) => (
        <MenuItem
          key={basemap.id}
          onClick={() => handleBasemapChange(basemap.id)}
        >
          {basemap.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Basemaps; 