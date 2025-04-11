import {
  Autocomplete,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";

import { metricConfigs } from "layouts/dashboard/components/Map/config/layers";
import { defaultLayers } from "layouts/dashboard/components/Map/config/layers";
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
    addedLayers,
    setAddedLayers,
  } = useMap();

  const searchOptions = Object.entries(metricConfigs).map(([id, config]) => ({
    id,
    label: `Add ${config.label}`,
    description: `Add ${config.label} layer to map`,
  }));

  // Debug log when mapInstance changes
  useEffect(() => {
    console.log("Map instance updated in NavbarSearch:", mapInstance);
    if (!mapInstance) {
      console.warn("Map instance is null/undefined in NavbarSearch");
    }
  }, [mapInstance]);

  const addLayer = (layerId) => {
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

      // Add to added layers set
      setAddedLayers((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });

      // Update visibility
      setLayerVisibility((prev) => ({
        ...prev,
        [id]: true,
      }));
      setSelectedMetric(id);

      // Handle the layer
      if (!overlayLayers?.[id]) {
        console.log("Layer not in overlayLayers, adding from defaultLayers");
        const layer = defaultLayers[id];
        if (layer) {
          try {
            // Add layer to map
            mapInstance.addLayer(layer);
            console.log("Layer added to map successfully");

            // Update overlayLayers
            setOverlayLayers((prev) => ({
              ...prev,
              [id]: layer,
            }));
          } catch (error) {
            console.error("Error adding layer to map:", error);
          }
        } else {
          console.warn("Layer not found in defaultLayers:", id);
        }
      } else {
        console.log("Layer already exists in overlayLayers");
        if (overlayLayers[id]) {
          overlayLayers[id].setVisible(true);
          console.log("Layer visibility set to true");
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

  return (
    <>
      <StyledAutocomplete
        freeSolo
        options={searchOptions}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onChange={handleOptionSelect}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Box component="span" sx={{ fontWeight: "bold" }}>
                {option.label}
              </Box>
              <Box component="p" sx={{ fontSize: "0.8rem", color: "text.secondary", m: 0 }}>
                {option.description}
              </Box>
            </Box>
          </Box>
        )}
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Add Layer
          </Button>
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
