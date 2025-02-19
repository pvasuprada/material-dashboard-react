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
import { Polygon, Point } from "ol/geom";
import { Fill, Style, Stroke, Circle as CircleStyle } from "ol/style";
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
  selectSelectedLocation,
  clearSelectedLocation,
} from "store/slices/mapSlice";
import MDAlert from "components/MDAlert";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { useTheme } from "@mui/material/styles";
import { useMaterialUIController } from "context";
import { Divider } from "@mui/material";
import { Radio } from "@mui/material";

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
  const [selectedMetric, setSelectedMetric] = useState('user_count');
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
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const selectedLocation = useSelector(selectSelectedLocation);
  const selectedFeatureLayerRef = useRef(null);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [clickedCoordinate, setClickedCoordinate] = useState(null);

  const createCustomControl = (element) => {
    const customControl = new Control({
      element: element,
    });
    return customControl;
  };

  const getColorForMetric = (feature) => {
    const value = feature.get(selectedMetric);
    let opacity = 0.2;
    
    if (value) {
      // Normalize the value between 0.2 and 0.8 for opacity
      switch(selectedMetric) {
        case 'user_count':
          opacity = Math.min(0.8, 0.2 + value * 0.2);
          break;
        case 'avg_dl_latency':
          opacity = Math.min(0.8, 0.2 + (value / 10)); // Assuming max latency of 10
          break;
        case 'total_dl_volume':
          opacity = Math.min(0.8, 0.2 + (value / 5)); // Assuming max volume of 5
          break;
        default:
          opacity = 0.5;
      }
    }

    // Different colors for different metrics
    const colors = {
      user_count: [255, 0, 0], // Red
      avg_dl_latency: [0, 0, 255], // Blue
      total_dl_volume: [255, 192, 203], // Pink
    };

    const [r, g, b] = colors[selectedMetric] || colors.user_count;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const createHexbinStyle = (feature) => {
    return new Style({
      fill: new Fill({
        color: getColorForMetric(feature),
      }),
      stroke: new Stroke({
        color: getColorForMetric(feature).replace(/[\d.]+\)$/, '1)'), // Full opacity for stroke
        width: 1,
      }),
    });
  };

  const createHexbinLayer = () => {
    return new VectorLayer({
      source: new VectorSource(),
      title: "Hexbins",
      visible: true,
      style: createHexbinStyle,
    });
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
    hexbins: createHexbinLayer(),
  };

  const updateHexbins = async () => {
    try {
      if (averages && Array.isArray(averages) && mapInstanceRef.current) {
        console.log("Updating hexbins with metric:", selectedMetric);
        console.log("Averages data:", averages);

        const features = averages.map(({ geobin, user_count, avg_dl_latency, total_dl_volume }) => {
          const hexBoundary = h3.cellToBoundary(geobin);
          const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];
          const feature = new Feature({
            geometry: new Polygon(coordinates),
          });

          // Set all metrics on the feature
          feature.set("user_count", user_count);
          feature.set("geobin", geobin);
          feature.set("avg_dl_latency", avg_dl_latency);
          feature.set("total_dl_volume", total_dl_volume);
          return feature;
        });

        // Find the hexbin layer
        const hexbinLayer = mapInstanceRef.current.getLayers().getArray()
          .find(layer => layer.get('title') === 'Hexbins');

        if (hexbinLayer) {
          const source = hexbinLayer.getSource();
          source.clear();
          source.addFeatures(features);
          
          // Update the style function
          hexbinLayer.setStyle(createHexbinStyle);
          
          // Ensure the layer is visible
          hexbinLayer.setVisible(true);
          
          // Force redraw
          source.changed();
          
          console.log("Hexbin layer updated with", features.length, "features");
        } else {
          console.error("Hexbin layer not found");
        }

        // Update the view extent if needed
        if (extent) {
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

  // Add this function to handle selected location updates
  const updateSelectedLocation = () => {
    if (!mapInstanceRef.current) return;

    // Remove existing selected feature layer if it exists
    if (selectedFeatureLayerRef.current) {
      mapInstanceRef.current.removeLayer(selectedFeatureLayerRef.current);
      selectedFeatureLayerRef.current = null;
    }

    if (selectedLocation) {
      const { longitude, latitude } = selectedLocation;
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });

      // Create a distinctive style for the selected location
      const style = new Style({
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: "#ff0000",
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 1,
          }),
        }),
      });

      feature.setStyle(style);

      // Create a new vector layer for the selected feature
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [feature],
        }),
        zIndex: 999, // Ensure it's on top of other layers
      });

      selectedFeatureLayerRef.current = vectorLayer;
      mapInstanceRef.current.addLayer(vectorLayer);
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
          setClickedFeature(feature);
          setClickedCoordinate(coordinates);
          updatePopup(feature, coordinates);
        } else {
          setClickedFeature(null);
          setClickedCoordinate(null);
          popupRef.current.style.display = "none";
          dispatch(clearSelectedLocation());
        }
      });

      // Add pointer cursor for features
      mapInstanceRef.current.on("pointermove", (evt) => {
        const pixel = mapInstanceRef.current.getEventPixel(evt.originalEvent);
        const hit = mapInstanceRef.current.hasFeatureAtPixel(pixel);
        mapInstanceRef.current.getViewport().style.cursor = hit ? "pointer" : "";
      });

      // Initial update of hexbins
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

  // Update useEffect to watch for darkMode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Change basemap when dark mode changes
      if (darkMode) {
        handleBasemapChange("dark");
      } else {
        handleBasemapChange("light");
      }
    }
  }, [darkMode, mapInstanceRef.current]);

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

  // Add effect to update selected location when it changes
  useEffect(() => {
    updateSelectedLocation();
  }, [selectedLocation]);

  // Update useEffect for metric changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      console.log("Selected metric changed to:", selectedMetric);
      const hexbinLayer = mapInstanceRef.current.getLayers().getArray()
        .find(layer => layer.get('title') === 'Hexbins');
      
      if (hexbinLayer) {
        // Update the style function
        hexbinLayer.setStyle(createHexbinStyle);
        // Force redraw
        hexbinLayer.getSource().changed();
        // Update popup if there's a clicked feature
        if (clickedFeature && clickedCoordinate) {
          updatePopup(clickedFeature, clickedCoordinate);
        }
      }
    }
  }, [selectedMetric]);

  // Function to update popup content
  const updatePopup = (feature, coordinates) => {
    if (!feature || !coordinates) return;

    const geobin = feature.get("geobin");
    const value = feature.get(selectedMetric);

    // Show popup
    popupRef.current.style.display = "block";
    popupOverlayRef.current.setPosition(coordinates);

    // Get the metric label
    const metricLabels = {
      user_count: "User Count",
      avg_dl_latency: "Avg Download Latency",
      total_dl_volume: "Total Download Volume"
    };

    // Get the unit for the metric
    const metricUnits = {
      user_count: "",
      avg_dl_latency: "ms",
      total_dl_volume: "GB"
    };

    // Update popup content with only selected metric
    const popupContent = document.getElementById("popup-content");
    popupContent.innerHTML = `
      <div>
        <strong>Geobin:</strong> ${geobin}<br>
        <strong>${metricLabels[selectedMetric]}:</strong> ${value || 'N/A'}${value ? ` ${metricUnits[selectedMetric]}` : ''}
      </div>
    `;
  };

  // Update the metric selection handler
  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
    if (mapInstanceRef.current) {
      const hexbinLayer = mapInstanceRef.current.getLayers().getArray()
        .find(layer => layer.get('title') === 'Hexbins');
      
      if (hexbinLayer) {
        // Update the style function
        hexbinLayer.setStyle(createHexbinStyle);
        // Force redraw
        hexbinLayer.getSource().changed();
        // Update popup if there's a clicked feature
        if (clickedFeature && clickedCoordinate) {
          updatePopup(clickedFeature, clickedCoordinate);
        }
      }
    }
  };

  // Add effect to update popup when metric changes
  useEffect(() => {
    if (clickedFeature && clickedCoordinate) {
      updatePopup(clickedFeature, clickedCoordinate);
    }
  }, [selectedMetric]);

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
              <Divider />
              <MenuItem>
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedMetric === 'user_count'}
                      onChange={() => handleMetricChange('user_count')}
                    />
                  }
                  label="User Count (Red)"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedMetric === 'avg_dl_latency'}
                      onChange={() => handleMetricChange('avg_dl_latency')}
                    />
                  }
                  label="Avg Download Latency (Blue)"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedMetric === 'total_dl_volume'}
                      onChange={() => handleMetricChange('total_dl_volume')}
                    />
                  }
                  label="Total Download Volume (Pink)"
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
