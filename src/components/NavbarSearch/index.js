import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import {
  Autocomplete,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as h3 from "h3-js";
import { Style, Fill, Stroke, Text } from "ol/style";

import api from "services/api";

import MDButton from "components/MDButton";
import { metricConfigs, defaultLayers } from "layouts/dashboard/components/Map/config/layers";
import { useMap } from "../../context/MapContext";

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: 300,
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    borderRadius: "8px",
    padding: "2px 8px",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    },
  },
}));

// Simple search box component when MapContext is not available
const SimpleSearch = () => (
  <TextField
    placeholder="Search here"
    size="small"
    sx={{
      width: 300,
      "& .MuiInputBase-root": {
        height: "32px",
        fontSize: "0.875rem",
      },
    }}
  />
);

// Main search component with autocomplete when MapContext is available
const AutocompleteSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const {
    mapInstance,
    setLayerVisibility,
    overlayLayers,
    setOverlayLayers,
    setSelectedMetric,
    setAddedLayers,
  } = useMap();

  // Get market and gnodeb from Redux state
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);

  const searchOptions = Object.entries(metricConfigs).map(([id, config]) => ({
    id,
    label: `Add ${config.label}`,
    description: `Add ${config.label} layer to map`,
    category: config.category || "ug",
  }));

  // Debug log when mapInstance changes
  useEffect(() => {
    console.log("Map instance updated in NavbarSearch:", mapInstance);
    if (!mapInstance) {
      console.warn("Map instance is null/undefined in NavbarSearch");
    }
  }, [mapInstance]);

  const addLayer = async (layerId) => {
    console.log("Adding layer:", layerId);
    console.log("Map instance:", mapInstance);

    if (!layerId) {
      console.warn("No layer ID provided");
      return;
    }

    if (!mapInstance) {
      console.warn("Map instance not available");
      return;
    }

    // Find the option that matches either by ID or by label
    const option = searchOptions.find(
      (opt) => opt.id === layerId || opt.label.toLowerCase().includes(layerId.toLowerCase())
    );

    if (option) {
      const id = option.id;
      console.log("Found matching option:", option);

      // Check if it's a Truecall layer
      const isTruecallLayer = ["rec_cnt", "erab_drop_pct", "volte_erab_drop_pct"].includes(id);

      if (isTruecallLayer) {
        // Validate required parameters
        if (!selectedFilters.market || !selectedFilters.gnodeb) {
          console.warn("Market or GNodeB not selected");
          return;
        }

        try {
          const response = await api.getTruecallData({
            market: selectedFilters.market.value,
            gnodeb: selectedFilters.gnodeb.value,
            kpi_name: id,
          });

          // Update the layer with the received data
          if (response && overlayLayers?.[id]) {
            const layer = overlayLayers[id];
            if (layer && typeof layer.getSource === "function") {
              const source = layer.getSource();
              if (source && typeof source.clear === "function") {
                source.clear(); // Clear existing features

                // Calculate min and max values for color scaling
                const values = response.map((item) => item[id]); // Use the layer id (rec_cnt, erab_drop_pct, etc.)
                const minValue = Math.min(...values);
                const maxValue = Math.max(...values);
                const midValue = (minValue + maxValue) / 2;

                console.log("Value ranges for", id, ":", { minValue, maxValue, midValue, values });

                // Create and add features for each h3 index
                const features = response.map((item) => {
                  // Get h3 hexagon coordinates
                  const hexCoords = h3.cellToBoundary(item.h3_index, true); // true for GeoJSON format

                  // Convert coordinates to OpenLayers format
                  const coordinates = [hexCoords.map(([lng, lat]) => fromLonLat([lng, lat]))];

                  // Create feature
                  const feature = new Feature({
                    geometry: new Polygon(coordinates),
                  });

                  const value = item[id]; // Use the layer id to get the correct value
                  // Calculate normalized value between 0 and 1
                  const normalizedValue = (value - minValue) / (maxValue - minValue);

                  // Set the metric value as a property
                  feature.set(id, value);

                  // Calculate color based on value
                  let r, g, b;
                  if (value <= midValue) {
                    // Red to Yellow transition
                    r = 255;
                    g = Math.round(((value - minValue) / (midValue - minValue)) * 255);
                    b = 0;
                  } else {
                    // Yellow to Green transition
                    r = Math.round(((maxValue - value) / (maxValue - midValue)) * 255);
                    g = 255;
                    b = 0;
                  }

                  // Set color and text style properties
                  feature.set("color", `rgba(${r}, ${g}, ${b})`);
                  feature.set("geobin", item.h3_index);
                  feature.set("text", value.toFixed(2).toString());
                  feature.set("textStyle", {
                    fill: "white",
                    stroke: "black",
                    strokeWidth: 2,
                    font: "12px sans-serif",
                  });

                  return feature;
                });

                // Add all features to the source
                source.addFeatures(features);

                // Make sure the layer is visible first
                layer.setVisible(true);

                // Update layer style to include text
                layer.setStyle((feature) => {
                  const color = feature.get("color");
                  const text = feature.get("text");
                  const textStyle = feature.get("textStyle");

                  if (color) {
                    const fillColor = color;
                    const strokeColor = color.replace(/,[^,]+\)/, ",1)"); // Set full opacity for stroke

                    return [
                      new Style({
                        fill: new Fill({
                          color: fillColor,
                        }),
                        stroke: new Stroke({
                          color: strokeColor,
                          width: 1,
                        }),
                      }),
                      new Style({
                        text: new Text({
                          text: text,
                          fill: new Fill({
                            color: textStyle.fill,
                          }),
                          stroke: new Stroke({
                            color: textStyle.stroke,
                            width: textStyle.strokeWidth,
                          }),
                          font: textStyle.font,
                          overflow: true,
                          textAlign: "center",
                          textBaseline: "middle",
                        }),
                      }),
                    ];
                  }
                });

                // Wait for the next frame to ensure features are rendered
                setTimeout(() => {
                  // Calculate extent from all features
                  const extent = source.getExtent();
                  console.log("Calculated extent:", extent);

                  // Check if extent is valid (not empty/infinite)
                  if (extent && extent.every((coord) => Number.isFinite(coord))) {
                    console.log("Fitting to extent:", extent);
                    mapInstance.getView().fit(extent, {
                      padding: [50, 50, 50, 50],
                      duration: 1000,
                      maxZoom: 15, // Prevent zooming in too far
                    });
                  } else {
                    console.warn("Invalid extent:", extent);
                  }
                }, 100);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching Truecall data:", error);
          return;
        }
      }

      // Add to added layers set
      setAddedLayers((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });

      // Update visibility
      setLayerVisibility((prev) => {
        const newState = {
          ...prev,
          [id]: true,
        };
        console.log("Updated layer visibility state:", newState);
        return newState;
      });
      setSelectedMetric(id);

      // Handle the layer
      if (!overlayLayers?.[id]) {
        console.log("Layer not in overlayLayers, adding from defaultLayers");
        const layer = defaultLayers[id];
        if (layer) {
          try {
            // Set visibility before adding to map
            layer.setVisible(true);
            console.log("Layer visibility set to true");

            // Add layer to map
            mapInstance.addLayer(layer);
            console.log("Layer added to map successfully");

            // Update overlayLayers
            setOverlayLayers((prev) => {
              const newLayers = {
                ...prev,
                [id]: layer,
              };
              console.log("Updated overlay layers:", newLayers);
              return newLayers;
            });

            // Force a re-render of the layer
            layer.changed();
          } catch (error) {
            console.error("Error adding layer to map:", error);
          }
        } else {
          console.warn("Layer not found in defaultLayers:", id);
        }
      } else {
        console.log("Layer already exists in overlayLayers");
        if (overlayLayers[id]) {
          const layer = overlayLayers[id];
          layer.setVisible(true);
          console.log("Layer visibility set to true for existing layer");
          // Force a re-render of the layer
          layer.changed();
        }
      }

      setInputValue("");
    } else {
      console.warn("No matching option found for:", layerId);
    }
  };

  const handleOptionSelect = (event, option) => {
    if (option) {
      setSelectedOption(option);
      setOpenConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (selectedOption) {
      addLayer(selectedOption.id);
    }
    setOpenConfirm(false);
    setSelectedOption(null);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setSelectedOption(null);
    setInputValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const matchingOption = searchOptions.find((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      if (matchingOption) {
        setSelectedOption(matchingOption);
        setOpenConfirm(true);
      }
    }
  };

  // Render option with category
  const renderOption = (props, option) => (
    <Box component="li" {...props}>
      <Box>
        <Box component="span" sx={{ fontWeight: "bold" }}>
          {option.label}
        </Box>
        <Box component="p" sx={{ fontSize: "0.8rem", color: "text.secondary", m: 0 }}>
          {option.description}
        </Box>
        <Box
          component="p"
          sx={{ fontSize: "0.7rem", color: "text.secondary", m: 0, fontStyle: "italic" }}
        >
          Category: {option.category || "UG"}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAutocomplete
        freeSolo
        options={searchOptions}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleOptionSelect}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
        renderOption={renderOption}
        groupBy={(option) => option.category || "ug"}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search here"
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              type: "text",
            }}
          />
        )}
      />

      <Dialog open={openConfirm} onClose={handleCancel}>
        <DialogTitle>Add Layer</DialogTitle>
        <DialogContent>
          Are you sure you want to add {selectedOption?.label} to the map and layer list?
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCancel} variant="outlined" color="dark">
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirm} variant="outlined" color="dark">
            Add Layer
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

const NavbarSearch = () => {
  let hasMapContext = true;
  try {
    useMap();
  } catch {
    hasMapContext = false;
  }

  return hasMapContext ? <AutocompleteSearch /> : <SimpleSearch />;
};

export default NavbarSearch;
