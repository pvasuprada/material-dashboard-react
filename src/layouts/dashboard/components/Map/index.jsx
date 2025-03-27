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

// React and Redux imports
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Material UI imports
import Card from "@mui/material/Card";
import { Divider, Fab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// OpenLayers imports
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Polygon, Point } from "ol/geom";
import { Fill, Style, Stroke, Circle as CircleStyle, Icon, RegularShape, Text } from "ol/style";
import { fromLonLat } from "ol/proj";
import Control from "ol/control/Control";
import { defaults as defaultControls } from "ol/control";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { WKT } from "ol/format";
import { extend as extendExtent } from "ol/extent";

// Third party imports
import * as h3 from "h3-js";

// Local imports
import { api } from "services/api";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";
import { MapControls } from "./components";
import { createBasemaps } from "./config/basemaps";
import { defaultLayers, metricConfigs } from "./config/layers";
import { MapProvider, useMap } from "../../../../context/MapContext";
import SiteGrid from "../SiteGrid";

// Redux actions and selectors
import {
  selectMapAverages,
  selectMapExtent,
  selectMapLoading,
  selectMapError,
  selectMapCenter,
  selectMapZoom,
  selectSelectedLocation,
  clearSelectedLocation,
  selectNetworkGenieLayers,
  selectSelectedSites,
  addSelectedSite,
} from "store/slices/mapSlice";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import { Menu, MenuItem, Checkbox, FormControlLabel, Radio } from "@mui/material";
import { MapProvider as MapProviderContext } from "../../../../context/MapContext";
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
  const filterParams = useSelector((state) => state.map.selectedFilters);
  const gridData = useSelector((state) => state.grid.gridData);
  const selectedSites = useSelector(selectSelectedSites);
  const [showGridInFullscreen, setShowGridInFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add effect to update data layers when averages change
  useEffect(() => {
    if (mapInstance && averages && Array.isArray(averages)) {
      console.log("Updating data layers with averages:", averages);

      const features = averages.map((average) => {
        const hexBoundary = h3.cellToBoundary(average.geobin);
        const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];
        const feature = new Feature({
          geometry: new Polygon(coordinates),
        });

        // Set all metrics on the feature
        Object.keys(average).forEach((key) => {
          if (key !== "geobin" && typeof average[key] === "number") {
            feature.set(key, average[key]);
          }
        });
        feature.set("geobin", average.geobin);
        return feature;
      });

      // Update all data layers with the same features
      const dataLayers = [
        "user_count",
        "avg_dl_latency",
        "total_dl_volume",
        "avg_nr_dl_colume_share",
        "avg_nr_rsrp",
        "avg_nr_ul_volume_share",
        "dl_connections_count",
        "p10_dl_speed",
        "p10_ul_speed",
        "p50_dl_speed",
        "p50_ul_speed",
        "total_ul_volume",
        "ul_connections_count",
      ];

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

  const getColorFromRSRP = (rsrp, minRSRP, maxRSRP) => {
    const normalized = (rsrp - minRSRP) / (maxRSRP - minRSRP);
    const red = Math.min(255, 255 * (1 - normalized) * 2);
    const green = Math.min(255, 255 * normalized * 2);
    const blue = 0;
    return `rgba(${red}, ${green}, ${blue}, 1)`;
  };

  const updateCoverageCapacity = async (coverageData) => {
    try {
      if (coverageData?.data && Array.isArray(coverageData.data) && mapInstance) {
        console.log("Updating coverage capacity layer with data:", coverageData.data);
        const minRSRP = Math.min(...coverageData.data.map((item) => item.rsrp));
        const maxRSRP = Math.max(...coverageData.data.map((item) => item.rsrp));
        const features = coverageData.data.map(({ h3_text_string, rsrp, bn5_rsrp }) => {
          const hexBoundary = h3.cellToBoundary(h3_text_string);
          const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];
          const feature = new Feature({
            geometry: new Polygon(coordinates),
          });

          // Set coverage metrics on the feature
          feature.set("h3_index", h3_text_string);
          feature.set("bn77_rsrp", rsrp);
          feature.set("bn5_rsrp", bn5_rsrp);
          feature.setStyle(
            new Style({
              fill: new Fill({
                color: getColorFromRSRP(rsrp, minRSRP, maxRSRP),
              }),
              stroke: getColorFromRSRP(rsrp, minRSRP, maxRSRP),
              width: 1,
            })
          );
          return feature;
        });

        // Find or create the coverage capacity layer
        let coverageLayer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === "coverage_capacity");

        const source = coverageLayer.getSource();
        source.clear();
        source.addFeatures(features);

        // Set visibility based on layerVisibility state
        coverageLayer.setVisible(layerVisibility["coverage_capacity"] || false);

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
          let params = filterParams;
          const coverageData = await api.getCoverageCapacityData(params);
          updateCoverageCapacity(coverageData);

          // Fetch and update raw coverage data
          const rawCoverageData = await api.getRawCoverageCapacityData(params);
          updateRawCoverageLayer(rawCoverageData);
        } catch (error) {
          console.error("Error fetching coverage data:", error);
        }
      };
      fetchCoverageData();
    }
  }, [mapInstance, filterParams]);

  // Add function to update raw coverage layer
  const updateRawCoverageLayer = (rawCoverageData) => {
    if (!mapInstance || !rawCoverageData) return;

    try {
      // Find the raw coverage layer
      const rawCoverageLayer = mapInstance
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "raw_coverage");

      if (!rawCoverageLayer) {
        console.error("Raw coverage layer not found");
        return;
      }

      // Parse WKT and create features
      const features = rawCoverageData.map((record) => {
        const format = new WKT();
        const geometry = format.readGeometry(record.geom, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });

        const feature = new Feature({
          geometry: geometry,
        });

        // Add properties to the feature
        feature.setProperties({
          carrier: record.carrier,
          enodeb_id: record.enodeb_id,
          fuze_site_id: record.fuze_site_id,
        });

        return feature;
      });

      // Update the layer source
      const source = rawCoverageLayer.getSource();
      source.clear();
      source.addFeatures(features);

      // Set visibility based on layerVisibility state
      rawCoverageLayer.setVisible(layerVisibility["raw_coverage"] || false);

      // If there are features and the layer is visible, fit to extent
      if (features.length > 0 && layerVisibility["raw_coverage"]) {
        const extent = source.getExtent();
        mapInstance.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating raw coverage layer:", error);
    }
  };

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
        image: new RegularShape({
          points: 4,
          radius: 14,
          angle: Math.PI / 4,
          fill: new Fill({
            color: "transparent",
          }),
          stroke: new Stroke({
            color: "#ff0000",
            width: 2,
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

    // Show popup
    popupRef.current.style.display = "block";
    popupOverlayRef.current.setPosition(coordinates);

    // Get all visible layers and their data
    const visibleLayers = Object.entries(layerVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([layerId]) => ({
        id: layerId,
        label: metricConfigs[layerId]?.label || layerId,
        value: feature.get(layerId),
        unit: metricConfigs[layerId]?.unit || "",
      }))
      .filter((layer) => layer.value !== undefined);

    // Update popup content with accordion for each visible layer
    const popupContent = document.getElementById("popup-content");
    popupContent.innerHTML = `
      <div style="max-height: 300px; overflow-y: auto;">
        <div style="margin-bottom: 8px;">
          <strong>Geobin:</strong> ${geobin}
        </div>
        ${visibleLayers
          .map(
            (layer, index) => `
          <div style="
            margin-bottom: 4px;
            padding: 8px;
            background-color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
            border-radius: 4px;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <strong>${layer.label}:</strong>
              <span>${layer.value}${layer.unit ? ` ${layer.unit}` : ""}</span>
            </div>
          </div>
        `
          )
          .join("")}
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

  // Replace the existing sites data effect with this new one
  useEffect(() => {
    if (mapInstance && gridData && gridData.length > 0) {
      try {
        // Create features from the grid data
        const features = gridData.map((site) => {
          const coordinates = fromLonLat([parseFloat(site.longitude), parseFloat(site.latitude)]);
          const feature = new Feature({
            geometry: new Point(coordinates),
          });

          // Add all site properties to the feature
          Object.keys(site).forEach((key) => {
            feature.set(key, site[key]);
          });

          return feature;
        });

        // Find or create the sites layer
        let sitesLayer = mapInstance
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === "sites_layer");

        if (!sitesLayer) {
          //sitesLayer = createSitesLayer();
          mapInstance.addLayer(sitesLayer);
          setOverlayLayers((prev) => ({
            ...prev,
            sites_layer: sitesLayer,
          }));
        }

        // Update the layer source with new features
        const source = sitesLayer.getSource();
        source.clear();
        source.addFeatures(features);

        // Set visibility based on layerVisibility state
        sitesLayer.setVisible(layerVisibility["sites_layer"] !== false); // Default to true if undefined

        // If the layer is visible and we have features, fit to extent
        if (layerVisibility["sites_layer"] !== false && features.length > 0) {
          const extent = source.getExtent();
          mapInstance.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
          });
        }

        // Add click interaction for popups
        const updateSitePopup = (feature, coordinates) => {
          if (!feature) return;

          const properties = feature.getProperties();
          delete properties.geometry; // Remove geometry from display

          // Create HTML content for popup
          const content = Object.entries(properties)
            .map(([key, value]) => `<strong>${key.toUpperCase()}:</strong> ${value}`)
            .join("<br>");

          // Show popup
          popupRef.current.style.display = "block";
          popupOverlayRef.current.setPosition(coordinates);

          // Update popup content
          const popupContent = document.getElementById("popup-content");
          popupContent.innerHTML = content;
        };

        // Update click handler to handle site features
        const existingClickListener = mapInstance.getListeners("click")[0];
        if (existingClickListener) {
          unByKey(existingClickListener);
        }

        mapInstance.on("click", (evt) => {
          const feature = mapInstance.forEachFeatureAtPixel(evt.pixel, (feature) => feature);

          if (feature) {
            const coordinates = evt.coordinate;
            if (feature.get("nwfid")) {
              // This is a site feature
              updateSitePopup(feature, coordinates);

              // Get all properties of the site
              const siteProperties = feature.getProperties();
              delete siteProperties.geometry; // Remove geometry from the properties

              // Check if site is already selected
              const isSelected = selectedSites.some((site) => site.nwfid === siteProperties.nwfid);

              if (!isSelected) {
                // Add to selected sites
                dispatch(addSelectedSite(siteProperties));
              }
            } else {
              // This is another type of feature (hexbin, etc.)
              updatePopup(feature, coordinates);
            }
            setClickedFeature(feature);
            setClickedCoordinate(coordinates);
          } else {
            setClickedFeature(null);
            setClickedCoordinate(null);
            popupRef.current.style.display = "none";
            dispatch(clearSelectedLocation());
          }
        });
      } catch (error) {
        console.error("Error updating sites layer:", error);
      }
    }
  }, [mapInstance, gridData, layerVisibility]);

  // Add effect to update selected sites visualization
  useEffect(() => {
    if (mapInstance && gridData) {
      // Find or create the sites layer
      let sitesLayer = mapInstance
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "sites_layer");

      if (sitesLayer) {
        const source = sitesLayer.getSource();
        const features = source.getFeatures();

        // Update styles based on selection
        features.forEach((feature) => {
          const isSelected = selectedSites.some((site) => site.nwfid === feature.get("nwfid"));

          const styles = [
            // Base tower icon style
            new Style({
              image: new Icon({
                src: "/sector360/towericon.png",
                scale: 0.03,
                anchor: [0.5, 0.5],
              }),
            }),
          ];

          // Add selection rectangle if selected
          if (isSelected) {
            styles.push(
              new Style({
                image: new RegularShape({
                  points: 4,
                  radius: 15,
                  angle: Math.PI / 4,
                  stroke: new Stroke({
                    color: "#ff0000",
                    width: 2,
                  }),
                  fill: new Fill({
                    color: "rgba(255, 0, 0, 0.1)",
                  }),
                }),
              })
            );
          }

          feature.setStyle(styles);
        });

        // If there are selected sites, fit the view to show all of them
        if (selectedSites.length > 0) {
          const selectedFeatures = features.filter((feature) =>
            selectedSites.some((site) => site.nwfid === feature.get("nwfid"))
          );

          if (selectedFeatures.length > 0) {
            const extent = selectedFeatures.reduce((ext, feature) => {
              const geom = feature.getGeometry();
              return ext ? extendExtent(ext, geom.getExtent()) : geom.getExtent();
            }, null);

            if (extent) {
              // Add padding to the extent
              const padding = [50, 50, 50, 50];
              mapInstance.getView().fit(extent, {
                padding,
                duration: 1000,
                maxZoom: 16,
                callback: () => {
                  // After fitting, zoom out by 1 level
                  const currentZoom = mapInstance.getView().getZoom();
                  mapInstance.getView().animate({
                    zoom: currentZoom - 1,
                    duration: 250,
                  });
                },
              });
            }
          }
        }
      }
    }
  }, [mapInstance, selectedSites, gridData]);

  // Add fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setShowGridInFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
                fontSize: "10px",
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

            {/* Grid Toggle Button in Fullscreen */}
            {isFullscreen && (
              <Fab
                sx={{
                  position: "absolute",
                  bottom: showGridInFullscreen ? "40%" : 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1000,
                  bgcolor: theme.palette.info.main,
                  "&:hover": {
                    bgcolor: theme.palette.secondary.main, // Material-UI's blue[800]
                  },
                }}
                size="small"
                onClick={() => setShowGridInFullscreen(!showGridInFullscreen)}
              >
                {showGridInFullscreen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Fab>
            )}

            {/* Grid in Fullscreen */}
            {isFullscreen && showGridInFullscreen && (
              <MDBox
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[4],
                  zIndex: 999,
                  overflow: "auto",
                }}
              >
                <SiteGrid isEmbedded={true} />
              </MDBox>
            )}
          </div>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Wrap the component with the provider
function MapComponent() {
  return (
    <MapProviderContext>
      <MapContent />
    </MapProviderContext>
  );
}

export default MapComponent;
