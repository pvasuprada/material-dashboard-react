import { Menu, MenuItem } from "@mui/material";
import { useMap } from "../context/MapContext";

const Basemaps = ({ container, anchorEl, onClose, onBasemapChange }) => {
  const { basemaps } = useMap();

  const basemapOptions = [
    { id: "osm", label: "OpenStreetMap" },
    { id: "streets", label: "Streets" },
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "satellite", label: "Satellite" },
    { id: "outdoors", label: "Outdoors" },
  ];

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
          onClick={() => {
            onBasemapChange(basemap.id);
            onClose();
          }}
        >
          {basemap.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Basemaps; 