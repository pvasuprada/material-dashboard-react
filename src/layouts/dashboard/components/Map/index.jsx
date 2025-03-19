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
  selectNetworkGenieLayers,
} from "store/slices/mapSlice";
import MDAlert from "components/MDAlert";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { useTheme } from "@mui/material/styles";
import { useMaterialUIController } from "context";
import { Divider } from "@mui/material";
import { Radio } from "@mui/material";
import { MapControls } from "./components";
import { createBasemaps } from "./config/basemaps";
import { defaultLayers, createHexbinStyle } from "./config/layers";
import { MapProvider, useMap } from "./context/MapContext";
import { MAPBOX_API_KEY } from "./config/keys";

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

function MapContent() {
  const mapRef = useRef(null);
  const {
    mapInstance,
    setMapInstance,
    basemaps,
    setBasemaps,
    overlayLayers,
    setOverlayLayers,
    currentBasemap,
    setCurrentBasemap,
    layerVisibility,
    setLayerVisibility,
    selectedMetric,
    setSelectedMetric,
  } = useMap();

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
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const selectedLocation = useSelector(selectSelectedLocation);
  const selectedFeatureLayerRef = useRef(null);
  const [clickedFeature, setClickedFeature] = useState(null);
  const [clickedCoordinate, setClickedCoordinate] = useState(null);
  const networkGenieLayers = useSelector(selectNetworkGenieLayers);

  // Add effect to update data layers when averages change
  useEffect(() => {
    if (mapInstance && averages && Array.isArray(averages)) {
      console.log("Updating data layers with averages:", averages);

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

      // Update all data layers with the same features
      const dataLayers = ["user_count", "avg_dl_latency", "total_dl_volume"];
      dataLayers.forEach((layerId) => {
        const layer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === layerId);
        if (layer) {
          console.log(`Updating layer ${layerId} with ${features.length} features`);
          const source = layer.getSource();
          source.clear();
          source.addFeatures(features.map((f) => f.clone()));

          // Ensure layer visibility matches the state
          layer.setVisible(layerVisibility[layerId] || false);
          console.log(`Setting visibility for ${layerId}: ${layerVisibility[layerId]}`);

          source.changed();

          // If the layer is visible, fit to its extent
          if (layerVisibility[layerId] && features.length > 0) {
            const extent = source.getExtent();
            mapInstance.getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 1000,
            });
          }
        } else {
          console.error(
            `Layer ${layerId} not found in map layers:`,
            mapInstance
              .getLayers()
              .getArray()
              .map((l) => l.get("title"))
          );
        }
      });
    }
  }, [averages, mapInstance, layerVisibility]);

  // Initialize map with layers
  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      console.log("Initializing map with dark mode:", darkMode);

      // Initialize basemaps and layers first
      const initialBasemaps = createBasemaps();
      const initialOverlayLayers = defaultLayers;

      // Set the initial basemap based on dark mode
      const initialBasemap = darkMode ? "dark" : "light";
      console.log("Setting initial basemap to:", initialBasemap);

      // Ensure basemap is visible
      const basemapLayer = initialBasemaps[initialBasemap];
      basemapLayer.setVisible(true);
      basemapLayer.setOpacity(1);

      // Create initial layers array with the correct basemap
      const initialLayers = [basemapLayer, ...Object.values(initialOverlayLayers)];

      // Create the map with the initial layers
      const map = new Map({
        target: mapRef.current,
        layers: initialLayers,
        view: new View({
          center: fromLonLat([-98, 40]), // Center on US by default
          zoom: 4,
          maxZoom: 18,
          minZoom: 2,
        }),
        controls: defaultControls({ zoom: false }),
      });

      // Set the state
      setBasemaps(initialBasemaps);
      setOverlayLayers(initialOverlayLayers);
      setMapInstance(map);
      setCurrentBasemap(initialBasemap);

      // Set initial layer visibility
      Object.entries(initialOverlayLayers).forEach(([key, layer]) => {
        if (layer) {
          layer.setVisible(layerVisibility[key] || false);
          console.log(`Setting initial visibility for ${key}: ${layerVisibility[key]}`);
        }
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

      map.addOverlay(popupOverlayRef.current);

      // Add click handler
      map.on("click", (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);

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
      map.on("pointermove", (evt) => {
        const pixel = map.getEventPixel(evt.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getViewport().style.cursor = hit ? "pointer" : "";
      });

      // Force initial render
      setTimeout(() => {
        map.updateSize();
        map.render();
      }, 100);
    }

    return () => {
      if (mapInstance) {
        mapInstance.setTarget(undefined);
        setMapInstance(null);
      }
    };
  }, [mapRef.current]);

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
      switch (selectedMetric) {
        case "user_count":
          opacity = Math.min(0.8, 0.2 + value * 0.2);
          break;
        case "avg_dl_latency":
          opacity = Math.min(0.8, 0.2 + value / 10); // Assuming max latency of 10
          break;
        case "total_dl_volume":
          opacity = Math.min(0.8, 0.2 + value / 5); // Assuming max volume of 5
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
        color: getColorForMetric(feature).replace(/[\d.]+\)$/, "1)"), // Full opacity for stroke
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

  const updateHexbins = async () => {
    try {
      if (averages && Array.isArray(averages) && mapInstance) {
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

        // Update all data layers with the same features
        const dataLayers = ["user_count", "avg_dl_latency", "total_dl_volume"];
        dataLayers.forEach((layerId) => {
          const layer = mapInstance
            .getLayers()
            .getArray()
            .find((layer) => layer.get("title") === layerId);
          if (layer) {
            const source = layer.getSource();
            source.clear();
            source.addFeatures(features.map((f) => f.clone()));
            source.changed();
          }
        });
      }
    } catch (error) {
      console.error("Error updating hexbins:", error);
    }
  };

  const updateCoverageCapacity = async (coverageData) => {
    try {
      if (coverageData?.data && Array.isArray(coverageData.data) && mapInstance) {
        console.log("Updating coverage capacity layer with data:", coverageData.data);

        const features = coverageData.data.map(({ h3_text_string, bn77_rsrp, bn5_rsrp }) => {
          const hexBoundary = h3.cellToBoundary(h3_text_string);
          const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];
          const feature = new Feature({
            geometry: new Polygon(coordinates),
          });

          // Set coverage metrics on the feature
          feature.set("h3_index", h3_text_string);
          feature.set("bn77_rsrp", bn77_rsrp);
          feature.set("bn5_rsrp", bn5_rsrp);
          return feature;
        });

        // Find or create the coverage capacity layer
        let coverageLayer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === "coverage_capacity");

        if (!coverageLayer) {
          coverageLayer = new VectorLayer({
            source: new VectorSource(),
            title: "coverage_capacity",
            style: (feature) =>
              new Style({
                fill: new Fill({
                  color: `rgba(139, 69, 19, ${Math.min(0.8, 0.2 + feature.get("bn77_rsrp") / 100)})`,
                }),
                stroke: new Stroke({
                  color: "rgba(139, 69, 19, 1)",
                  width: 1,
                }),
              }),
          });
          mapInstance.addLayer(coverageLayer);
        }

        const source = coverageLayer.getSource();
        source.clear();
        source.addFeatures(features);

        // Set visibility based on layerVisibility state
        coverageLayer.setVisible(layerVisibility["coverage_capacity"] || false);

        // Force redraw
        source.changed();

        console.log("Coverage capacity layer updated with", features.length, "features");

        // Update view extent if needed
        if (extent && features.length > 0) {
          const { xmin, ymin, xmax, ymax } = extent;
          const transformedExtent = [...fromLonLat([xmin, ymin]), ...fromLonLat([xmax, ymax])];
          mapInstance.getView().fit(transformedExtent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating coverage capacity layer:", error);
    }
  };

  // Add effect to handle layer visibility changes
  useEffect(() => {
    if (mapInstance) {
      Object.entries(layerVisibility).forEach(([layerId, isVisible]) => {
        const layer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === layerId);
        if (layer) {
          layer.setVisible(isVisible);
        }
      });
    }
  }, [layerVisibility, mapInstance]);

  // Add effect to update coverage capacity when data changes
  useEffect(() => {
    if (mapInstance) {
      // Fetch coverage capacity data when map instance is ready
      const fetchCoverageData = async () => {
        try {
          const coverageData = await api.getCoverageCapacityData();
          updateCoverageCapacity(coverageData);
        } catch (error) {
          console.error("Error fetching coverage capacity data:", error);
        }
      };
      fetchCoverageData();
    }
  }, [mapInstance]);

  // Add effect to test coverage capacity with sample data
  useEffect(() => {
    if (mapInstance) {
      const testData = {
        data: [
          {
            bn77_rsrp: 8,
            bn5_rsrp: 28,
            h3_text_string: "8a2a10728537fff",
          },
          {
            bn77_rsrp: 18,
            bn5_rsrp: 38,
            h3_text_string: "8a2a1072e26ffff",
          },
        ],
      };
      updateCoverageCapacity(testData);
    }
  }, [mapInstance]);

  // Add this function to handle selected location updates
  const updateSelectedLocation = () => {
    if (!mapInstance) return;

    // Remove existing selected feature layer if it exists
    if (selectedFeatureLayerRef.current) {
      mapInstance.removeLayer(selectedFeatureLayerRef.current);
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
      mapInstance.addLayer(vectorLayer);
    }
  };

  // Update effect for dark mode changes
  useEffect(() => {
    if (mapInstance && basemaps) {
      const newBasemap = darkMode ? "dark" : "light";
      console.log("Dark mode changed:", darkMode, "New basemap:", newBasemap);

      try {
        // Get the layers collection
        const layers = mapInstance.getLayers();
        const allLayers = layers.getArray();

        // Store current view state
        const view = mapInstance.getView();
        const currentCenter = view.getCenter();
        const currentZoom = view.getZoom();

        // Get current basemap layer (should be at index 0)
        const currentBasemapLayer = allLayers[0];

        // Create and configure new basemap layer
        const newBasemapLayer = basemaps[newBasemap];
        newBasemapLayer.setVisible(true);
        newBasemapLayer.setOpacity(1);

        // Replace the basemap layer
        if (currentBasemapLayer) {
          layers.remove(currentBasemapLayer);
        }
        layers.insertAt(0, newBasemapLayer);

        // Update context
        setCurrentBasemap(newBasemap);

        // Force map update
        mapInstance.updateSize();

        // Restore view state with animation
        view.animate({
          center: currentCenter,
          zoom: currentZoom,
          duration: 0, // Instant transition
        });

        console.log("Successfully updated basemap to:", newBasemap);

        // Force immediate render
        requestAnimationFrame(() => {
          mapInstance.render();
        });
      } catch (error) {
        console.error("Error switching basemap:", error);
      }
    }
  }, [darkMode, mapInstance, basemaps]);

  useEffect(() => {
    // Update hexbins when averages data changes
    if (averages && mapInstance) {
      updateHexbins();
    }
  }, [averages]);

  // Add effect to handle extent changes
  useEffect(() => {
    if (mapInstance && extent) {
      const { xmin, ymin, xmax, ymax } = extent;
      const transformedExtent = [...fromLonLat([xmin, ymin]), ...fromLonLat([xmax, ymax])];
      mapInstance.getView().fit(transformedExtent, {
        padding: [50, 50, 50, 50],
        duration: 1000,
      });
    }
  }, [extent]);

  // Add effect to handle center/zoom changes from Redux
  useEffect(() => {
    if (mapInstance) {
      const view = mapInstance.getView();
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
    if (basemapKey && basemapKey !== currentBasemap && mapInstance) {
      mapInstance.getLayers().removeAt(0);
      mapInstance.getLayers().insertAt(0, basemaps[basemapKey]);
      setCurrentBasemap(basemapKey);
    }
  };

  const handleLayerToggle = (layerKey) => {
    const newVisibility = !layerVisibility[layerKey];
    setLayerVisibility((prev) => ({
      ...prev,
      [layerKey]: newVisibility,
    }));
    if (overlayLayers[layerKey]) {
      overlayLayers[layerKey].setVisible(newVisibility);
    }
  };

  // Add effect to update selected location when it changes
  useEffect(() => {
    updateSelectedLocation();
  }, [selectedLocation]);

  // Update useEffect for metric changes
  useEffect(() => {
    if (mapInstance) {
      console.log("Selected metric changed to:", selectedMetric);
      const hexbinLayer = mapInstance
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Hexbins");

      if (hexbinLayer) {
        hexbinLayer.setStyle((feature) => createHexbinStyle(feature, selectedMetric));
        hexbinLayer.getSource().changed();
        if (clickedFeature && clickedCoordinate) {
          updatePopup(clickedFeature, clickedCoordinate);
        }
      }
    }
  }, [selectedMetric]);

  const handleZoomIn = () => {
    if (!mapInstance) return;
    const view = mapInstance.getView();
    view.animate({
      zoom: view.getZoom() + 1,
      duration: 250,
    });
  };

  const handleZoomOut = () => {
    if (!mapInstance) return;
    const view = mapInstance.getView();
    view.animate({
      zoom: view.getZoom() - 1,
      duration: 250,
    });
  };

  const handleFullscreenToggle = () => {
    const mapElement = mapRef.current;
    if (!document.fullscreenElement) {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if (mapElement.webkitRequestFullscreen) {
        mapElement.webkitRequestFullscreen();
      } else if (mapElement.msRequestFullscreen) {
        mapElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleMetricChange = (metric) => {
    console.log("Changing metric to:", metric);
    setSelectedMetric(metric);

    // Update the layer styles if needed
    if (mapInstance) {
      const layers = mapInstance.getLayers().getArray();
      layers.forEach((layer) => {
        if (layer.get("title") === metric) {
          layer.setVisible(true);
          const source = layer.getSource();
          if (source && source.getFeatures().length > 0) {
            const extent = source.getExtent();
            mapInstance.getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 1000,
            });
          }
        }
      });
    }
  };

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
      total_dl_volume: "Total Download Volume",
    };

    // Get the unit for the metric
    const metricUnits = {
      user_count: "",
      avg_dl_latency: "ms",
      total_dl_volume: "GB",
    };

    // Update popup content with only selected metric
    const popupContent = document.getElementById("popup-content");
    popupContent.innerHTML = `
      <div>
        <strong>Geobin:</strong> ${geobin}<br>
        <strong>${metricLabels[selectedMetric]}:</strong> ${value || "N/A"}${value ? ` ${metricUnits[selectedMetric]}` : ""}
      </div>
    `;
  };

  // Add effect to handle NetworkGenie layers
  useEffect(() => {
    if (mapInstance && networkGenieLayers.length > 0) {
      // Get the latest layer
      const latestLayer = networkGenieLayers[networkGenieLayers.length - 1];

      console.log("Adding NetworkGenie layer:", latestLayer);

      try {
        // Create features from the records with validation
        const features = latestLayer.records
          .filter((record) => {
            // Validate WKT geometry
            const isValid =
              record.geom &&
              typeof record.geom === "string" &&
              record.geom.startsWith("POINT(") &&
              record.geom.endsWith(")");

            if (!isValid) {
              console.warn("Invalid geometry in record:", record);
            }
            return isValid;
          })
          .map((record) => {
            // Parse WKT POINT format: "POINT(longitude latitude)"
            const coordsStr = record.geom.substring(6, record.geom.length - 1);
            const [longitude, latitude] = coordsStr.split(" ").map(Number);

            // Validate parsed coordinates
            const isValidCoords =
              !isNaN(longitude) &&
              !isNaN(latitude) &&
              longitude >= -180 &&
              longitude <= 180 &&
              latitude >= -90 &&
              latitude <= 90;

            if (!isValidCoords) {
              console.warn("Invalid coordinates parsed from WKT:", record.geom);
              return null;
            }

            const coordinates = fromLonLat([longitude, latitude]);
            const feature = new Feature({
              geometry: new Point(coordinates),
            });

            // Add value and other properties to the feature
            feature.set("value", record.value);
            Object.keys(record).forEach((key) => {
              if (key !== "geom") {
                feature.set(key, record[key]);
              }
            });

            return feature;
          })
          .filter(Boolean); // Remove null features from invalid coordinates

        if (features.length === 0) {
          console.warn("No valid features to add to the map");
          return;
        }

        // Create a vector source with the features
        const source = new VectorSource({
          features: features,
        });

        // Create a vector layer with value-based styling
        const vectorLayer = new VectorLayer({
          source: source,
          title: "network_genie_layer_1", // Use consistent ID
          style: (feature) =>
            new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                  color: `rgba(255, 0, 0, ${Math.min(0.8, 0.2 + feature.get("value") / 5)})`,
                }),
                stroke: new Stroke({
                  color: "white",
                  width: 2,
                }),
              }),
            }),
        });

        // Remove any existing layer with the same name
        const existingLayer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === "network_genie_layer_1");
        if (existingLayer) {
          mapInstance.removeLayer(existingLayer);
        }

        // Add the new layer to the map
        mapInstance.addLayer(vectorLayer);

        // Add to overlayLayers
        setOverlayLayers((prev) => ({
          ...prev,
          network_genie_layer_1: vectorLayer,
        }));

        // Set initial visibility based on layerVisibility state
        vectorLayer.setVisible(layerVisibility.network_genie_layer_1 || false);

        // Get the extent and validate it
        const extent = source.getExtent();
        const isValidExtent =
          extent &&
          Array.isArray(extent) &&
          extent.length === 4 &&
          extent.every((coord) => coord !== Infinity && coord !== -Infinity && !isNaN(coord));

        // Fit the view to the layer extent if there are features and extent is valid
        if (features.length > 0 && isValidExtent) {
          mapInstance.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 16,
          });
        }
      } catch (error) {
        console.error("Error adding NetworkGenie layer:", error);
      }
    }
  }, [mapInstance, networkGenieLayers, layerVisibility]);

  return (
    <Card>
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
            <MapControls
              mapRef={mapRef}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onBasemapChange={handleBasemapChange}
              onLayerToggle={handleLayerToggle}
              onMetricChange={handleMetricChange}
              layerVisibility={layerVisibility}
              selectedMetric={selectedMetric}
              onFullscreenToggle={handleFullscreenToggle}
            />

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

// Wrap the component with the provider
function MapComponent() {
  return (
    <MapProvider>
      <MapContent />
    </MapProvider>
  );
}

export default MapComponent;
