/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import ImageWMS from "ol/source/ImageWMS";
import { fromLonLat } from "ol/proj";
import Control from "ol/control/Control";
import { defaults as defaultControls } from "ol/control";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the controls
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

const basemaps = {
  osm: new TileLayer({
    source: new OSM(),
    title: "OSM",
  }),
  satellite: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    }),
    title: "Satellite",
  }),
  terrain: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    }),
    title: "Terrain",
  }),
};

const overlayLayers = {
  hurricanes: new ImageLayer({
    source: new ImageWMS({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/0",
      params: { LAYERS: "0" },
    }),
    title: "Hurricanes",
    visible: true,
  }),
  geoserver: new ImageLayer({
    source: new ImageWMS({
      url: "https://ahocevar.com/geoserver/wms",
      params: { LAYERS: "topp:states" },
    }),
    title: "GeoServer Layer",
    visible: false,
  }),
};

function MapComponent() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [basemapAnchorEl, setBasemapAnchorEl] = useState(null);
  const [layersAnchorEl, setLayersAnchorEl] = useState(null);
  const [currentBasemap, setCurrentBasemap] = useState("osm");
  const [layerVisibility, setLayerVisibility] = useState({
    hurricanes: true,
    geoserver: false,
  });

  const createCustomControl = (element) => {
    const customControl = new Control({
      element: element,
    });
    return customControl;
  };

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const layers = [basemaps[currentBasemap], ...Object.values(overlayLayers)];

      // Create controls container
      const controlsContainer = document.createElement("div");
      Object.assign(controlsContainer.style, controlsContainerStyle);

      // Create zoom in control
      const zoomInButton = document.createElement("button");
      zoomInButton.innerHTML = '<i class="material-icons">add</i>';
      Object.assign(zoomInButton.style, controlStyle);
      zoomInButton.addEventListener("click", () => {
        const view = mapInstanceRef.current.getView();
        view.animate({
          zoom: view.getZoom() + 1,
          duration: 250,
        });
      });

      // Create zoom out control
      const zoomOutButton = document.createElement("button");
      zoomOutButton.innerHTML = '<i class="material-icons">remove</i>';
      Object.assign(zoomOutButton.style, controlStyle);
      zoomOutButton.addEventListener("click", () => {
        const view = mapInstanceRef.current.getView();
        view.animate({
          zoom: view.getZoom() - 1,
          duration: 250,
        });
      });

      // Create basemap control
      const basemapButton = document.createElement("button");
      basemapButton.innerHTML = '<i class="material-icons">map</i>';
      Object.assign(basemapButton.style, controlStyle);
      basemapButton.addEventListener("click", (e) => {
        setBasemapAnchorEl(e.currentTarget);
      });

      // Create layers control
      const layersButton = document.createElement("button");
      layersButton.innerHTML = '<i class="material-icons">layers</i>';
      Object.assign(layersButton.style, controlStyle);
      layersButton.addEventListener("click", (e) => {
        setLayersAnchorEl(e.currentTarget);
      });

      // Add all controls to container
      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(basemapButton);
      controlsContainer.appendChild(layersButton);

      const containerControl = createCustomControl(controlsContainer);

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: layers,
        view: new View({
          center: fromLonLat([-98, 39]),
          zoom: 4,
          maxZoom: 18,
          minZoom: 2,
        }),
        controls: defaultControls({ zoom: false }).extend([containerControl]),
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleBasemapChange = (basemapKey) => {
    setBasemapAnchorEl(null);
    if (basemapKey && basemapKey !== currentBasemap) {
      const map = mapInstanceRef.current;
      map.getLayers().removeAt(0);
      map.getLayers().insertAt(0, basemaps[basemapKey]);
      setCurrentBasemap(basemapKey);
    }
  };

  const handleLayerToggle = (layerKey) => {
    const newVisibility = !layerVisibility[layerKey];
    setLayerVisibility((prev) => ({
      ...prev,
      [layerKey]: newVisibility,
    }));
    overlayLayers[layerKey].setVisible(newVisibility);
  };

  return (
    <Card>
      {/* <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6">Interactive Map</MDTypography>
      </MDBox> */}
      <MDBox p={2}>
        <MDBox
          sx={{
            width: "100%",
            height: "400px",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          {/* Basemap Menu */}
          <Menu
            anchorEl={basemapAnchorEl}
            open={Boolean(basemapAnchorEl)}
            onClose={() => setBasemapAnchorEl(null)}
          >
            <MenuItem onClick={() => handleBasemapChange("osm")}>OpenStreetMap</MenuItem>
            <MenuItem onClick={() => handleBasemapChange("satellite")}>Satellite</MenuItem>
            <MenuItem onClick={() => handleBasemapChange("terrain")}>Terrain</MenuItem>
          </Menu>

          {/* Layers Menu */}
          <Menu
            anchorEl={layersAnchorEl}
            open={Boolean(layersAnchorEl)}
            onClose={() => setLayersAnchorEl(null)}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={layerVisibility.hurricanes}
                    onChange={() => handleLayerToggle("hurricanes")}
                  />
                }
                label="Hurricanes"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={layerVisibility.geoserver}
                    onChange={() => handleLayerToggle("geoserver")}
                  />
                }
                label="GeoServer Layer"
              />
            </MenuItem>
          </Menu>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default MapComponent;
