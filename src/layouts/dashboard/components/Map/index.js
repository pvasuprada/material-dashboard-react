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
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Fill, Style, Stroke } from "ol/style";
import * as h3 from "h3-js";
import { api } from "services/api";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMapAverages,
  selectMapExtent,
  selectMapLoading,
  selectMapError,
  selectMapCenter,
  selectMapZoom,
  updateMapView,
} from "store/slices/mapSlice";
import MDAlert from "components/MDAlert";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { useTheme } from "@mui/material/styles";

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
  streets: new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHZhc3VwcmFkYSIsImEiOiJjamllZXV4M2cwNXZ3M3ZwMXM4NzBxM2xjIn0.DhJvytW8s6yVVOFVL-Xuqg`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: "Streets",
  }),
  dark: new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHZhc3VwcmFkYSIsImEiOiJjamllZXV4M2cwNXZ3M3ZwMXM4NzBxM2xjIn0.DhJvytW8s6yVVOFVL-Xuqg`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: "Dark",
  }),
  light: new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHZhc3VwcmFkYSIsImEiOiJjamllZXV4M2cwNXZ3M3ZwMXM4NzBxM2xjIn0.DhJvytW8s6yVVOFVL-Xuqg`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: "Light",
  }),
  satellite: new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHZhc3VwcmFkYSIsImEiOiJjamllZXV4M2cwNXZ3M3ZwMXM4NzBxM2xjIn0.DhJvytW8s6yVVOFVL-Xuqg`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: "Satellite",
  }),
  outdoors: new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHZhc3VwcmFkYSIsImEiOiJjamllZXV4M2cwNXZ3M3ZwMXM4NzBxM2xjIn0.DhJvytW8s6yVVOFVL-Xuqg`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: "Outdoors",
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
  hexbins: new VectorLayer({
    source: new VectorSource(),
    title: "Hexbins",
    visible: true,
    style: (feature) => {
      const userCount = feature.get("user_count");
      // Make hexbins more visible with stronger colors and borders
      return new Style({
        fill: new Fill({
          color: `rgba(255, 0, 0, ${Math.min(0.8, 0.2 + userCount * 0.2)})`,
        }),
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 1,
        }),
      });
    },
  }),
};

function MapComponent() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [basemapAnchorEl, setBasemapAnchorEl] = useState(null);
  const [layersAnchorEl, setLayersAnchorEl] = useState(null);
  const [currentBasemap, setCurrentBasemap] = useState("light");
  const [layerVisibility, setLayerVisibility] = useState({
    hurricanes: true,
    geoserver: false,
    hexbins: true,
  });
  const averages = useSelector(selectMapAverages);
  const extent = useSelector(selectMapExtent);
  const loading = useSelector(selectMapLoading);
  const error = useSelector(selectMapError);
  const popupRef = useRef(null);
  const popupOverlayRef = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const center = useSelector(selectMapCenter);
  const zoom = useSelector(selectMapZoom);
  const [viewChangeTimeout, setViewChangeTimeout] = useState(null);

  const createCustomControl = (element) => {
    const customControl = new Control({
      element: element,
    });
    return customControl;
  };

  const updateHexbins = async () => {
    try {
      if (averages && Array.isArray(averages)) {
        console.log("Creating hexbin features from averages:", averages); // Debug log

        const features = averages.map(({ geobin, user_count }) => {
          // Get hexagon boundary coordinates
          const hexBoundary = h3.cellToBoundary(geobin);
          console.log("Hex boundary for", geobin, ":", hexBoundary); // Debug log

          // Convert to OpenLayers format (longitude, latitude)
          const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];

          // Create feature
          const feature = new Feature({
            geometry: new Polygon(coordinates),
          });

          feature.set("user_count", user_count);
          feature.set("geobin", geobin);
          return feature;
        });

        console.log("Created features:", features); // Debug log

        const hexbinLayer = overlayLayers.hexbins;
        const source = hexbinLayer.getSource();
        source.clear();
        source.addFeatures(features);

        // Ensure the layer is visible
        hexbinLayer.setVisible(true);

        if (mapInstanceRef.current && extent) {
          const { xmin, ymin, xmax, ymax } = extent;
          const transformedExtent = [...fromLonLat([xmin, ymin]), ...fromLonLat([xmax, ymax])];
          mapInstanceRef.current.getView().fit(transformedExtent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating hexbins:", error);
    }
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

      // Add fullscreen control button
      const fullscreenButton = document.createElement("button");
      fullscreenButton.innerHTML = '<i class="material-icons">fullscreen</i>';
      Object.assign(fullscreenButton.style, controlStyle);
      fullscreenButton.addEventListener("click", () => {
        const mapElement = mapRef.current;
        if (!document.fullscreenElement) {
          if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
          } else if (mapElement.webkitRequestFullscreen) {
            mapElement.webkitRequestFullscreen();
          } else if (mapElement.msRequestFullscreen) {
            mapElement.msRequestFullscreen();
          }
          fullscreenButton.innerHTML = '<i class="material-icons">fullscreen_exit</i>';
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          fullscreenButton.innerHTML = '<i class="material-icons">fullscreen</i>';
        }
      });

      // Add all controls to container
      controlsContainer.appendChild(zoomInButton);
      controlsContainer.appendChild(zoomOutButton);
      controlsContainer.appendChild(basemapButton);
      controlsContainer.appendChild(layersButton);
      controlsContainer.appendChild(fullscreenButton);

      const containerControl = createCustomControl(controlsContainer);

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: layers,
        view: new View({
          center: fromLonLat(center),
          zoom: zoom,
          maxZoom: 18,
          minZoom: 2,
        }),
        controls: defaultControls({ zoom: false }).extend([containerControl]),
      });

      // Initialize popup overlay
      popupOverlayRef.current = new Overlay({
        element: popupRef.current,
        positioning: "bottom-center",
        offset: [0, -10],
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      mapInstanceRef.current.addOverlay(popupOverlayRef.current);

      // Add click handler
      mapInstanceRef.current.on("click", (evt) => {
        const feature = mapInstanceRef.current.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );

        if (feature) {
          const coordinates = evt.coordinate;
          const userCount = feature.get("user_count");
          const geobin = feature.get("geobin");

          // Show popup
          popupRef.current.style.display = "block";
          popupOverlayRef.current.setPosition(coordinates);

          // Update popup content
          const popupContent = document.getElementById("popup-content");
          popupContent.innerHTML = `
            <div>
              <strong>Geobin:</strong> ${geobin}<br>
              <strong>User Count:</strong> ${userCount}
            </div>
          `;
        } else {
          // Hide popup when clicking outside features
          popupRef.current.style.display = "none";
        }
      });

      // Add pointer cursor for features
      mapInstanceRef.current.on("pointermove", (evt) => {
        const pixel = mapInstanceRef.current.getEventPixel(evt.originalEvent);
        const hit = mapInstanceRef.current.hasFeatureAtPixel(pixel);
        mapInstanceRef.current.getViewport().style.cursor = hit ? "pointer" : "";
      });

      // Add view change listener
      const view = mapInstanceRef.current.getView();
      view.on("change", () => {
        // Debounce view changes to prevent too many Redux updates
        if (viewChangeTimeout) {
          clearTimeout(viewChangeTimeout);
        }

        // setViewChangeTimeout(
        //   setTimeout(() => {
        //     const center = view.getCenter();
        //     const [lon, lat] = center.map((coord) => parseFloat(coord.toFixed(6)));
        //     dispatch(
        //       updateMapView({
        //         center: [lon, lat],
        //         zoom: view.getZoom(),
        //       })
        //     );
        //   }, 300)
        // );
      });

      // Call updateHexbins after map is initialized
      updateHexbins();
    }

    return () => {
      if (viewChangeTimeout) {
        clearTimeout(viewChangeTimeout);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update hexbins when averages data changes
    if (averages && mapInstanceRef.current) {
      updateHexbins();
    }
  }, [averages]);

  // Add effect to handle extent changes
  useEffect(() => {
    if (mapInstanceRef.current && extent) {
      const { xmin, ymin, xmax, ymax } = extent;
      const transformedExtent = [...fromLonLat([xmin, ymin]), ...fromLonLat([xmax, ymax])];
      mapInstanceRef.current.getView().fit(transformedExtent, {
        padding: [50, 50, 50, 50],
        duration: 1000,
      });
    }
  }, [extent]);

  // Add effect to handle center/zoom changes from Redux
  useEffect(() => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      const currentCenter = view.getCenter();
      const currentZoom = view.getZoom();

      // Only animate if the changes are significant
      const [currentLon, currentLat] = currentCenter;
      const [targetLon, targetLat] = fromLonLat(center);

      const centerChanged =
        Math.abs(currentLon - targetLon) > 0.00001 || Math.abs(currentLat - targetLat) > 0.00001;
      const zoomChanged = Math.abs(currentZoom - zoom) > 0.1;

      if (centerChanged || zoomChanged) {
        view.animate({
          center: fromLonLat(center),
          zoom: zoom,
          duration: 1000,
        });
      }
    }
  }, [center, zoom]);

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

  // Add more detailed error display
  if (error) {
    return (
      <Card>
        <MDBox p={2}>
          <MDAlert color="error" dismissible>
            <MDTypography variant="body2" color="white">
              Failed to load map data: {error}
              {process.env.NODE_ENV === "development" && (
                <div>
                  <small>
                    Please check:
                    <ul>
                      <li>API endpoint configuration</li>
                      <li>Network connection</li>
                      <li>Server status</li>
                    </ul>
                  </small>
                </div>
              )}
            </MDTypography>
          </MDAlert>
        </MDBox>
      </Card>
    );
  }

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
              position: "relative",
            }}
          >
            <Menu
              container={mapRef.current}
              anchorEl={basemapAnchorEl}
              open={Boolean(basemapAnchorEl)}
              onClose={() => setBasemapAnchorEl(null)}
              style={{ zIndex: 2000 }}
            >
              <MenuItem onClick={() => handleBasemapChange("osm")}>OpenStreetMap</MenuItem>
              <MenuItem onClick={() => handleBasemapChange("dark")}>Dark</MenuItem>
              <MenuItem onClick={() => handleBasemapChange("light")}>Light</MenuItem>
              <MenuItem onClick={() => handleBasemapChange("satellite")}>Satellite</MenuItem>
              <MenuItem onClick={() => handleBasemapChange("outdoors")}>Outdoors</MenuItem>
            </Menu>

            <Menu
              container={mapRef.current}
              anchorEl={layersAnchorEl}
              open={Boolean(layersAnchorEl)}
              onClose={() => setLayersAnchorEl(null)}
              style={{ zIndex: 2000 }}
            >
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
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={layerVisibility.hexbins}
                      onChange={() => handleLayerToggle("hexbins")}
                    />
                  }
                  label="Hexbins"
                />
              </MenuItem>
            </Menu>

            {/* Updated popup with theme-aware styles */}
            <div
              ref={popupRef}
              style={{
                display: "none",
                position: "absolute",
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: "10px",
                borderRadius: "4px",
                boxShadow: theme.shadows[2],
                border: `1px solid ${theme.palette.divider}`,
                minWidth: "150px",
                zIndex: 1000,
              }}
            >
              <div id="popup-content" style={{ color: theme.palette.text.primary }}></div>
              <div
                style={{
                  position: "absolute",
                  right: "5px",
                  top: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: theme.palette.text.primary,
                }}
                onClick={() => {
                  popupRef.current.style.display = "none";
                }}
              >
                ×
              </div>
            </div>
          </div>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default MapComponent;
