// MUI imports
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

// Third-party imports
import * as h3 from "h3-js";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Text } from "ol/style";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

// Local imports
import MDButton from "components/MDButton";
import { useMap } from "context/MapContext";
import { useInsights } from "context/insightsContext";
import {
  SPECIAL_LAYERS,
  VISUALIZATION_CONFIGS,
  getVisualizationConfig,
  getChartTitles,
  NQES_CHARTS,
  NQES_KPI_MAPPING,
  NQES_VISUALIZATION_CONFIG,
} from "layouts/dashboard/components/Map/config/chartAndLayers";
import {
  metricConfigs,
  defaultLayers,
  getColorForValue,
} from "layouts/dashboard/components/Map/config/layers";
import truecallParameters from "layouts/dashboard/components/Map/config/truecall.json";
import { transformVPIData } from "layouts/dashboard/data/transformers";
import api from "services/api";

// Constants
const DEFAULT_FEATURE_STYLE = {
  fill: "white",
  stroke: "black",
  strokeWidth: 2,
  font: "12px sans-serif",
};

// Styled components
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

// Helper functions
const createFeatureStyle = (color, text, textStyle) => [
  new Style({
    fill: new Fill({ color }),
    stroke: new Stroke({
      color: color.replace(/,[^,]+\)/, ",1)"),
      width: 1,
    }),
  }),
  new Style({
    text: new Text({
      text,
      fill: new Fill({ color: textStyle.fill }),
      stroke: new Stroke({
        color: textStyle.stroke,
        width: textStyle.strokeWidth,
      }),
      font: textStyle.font,
      textAlign: "center",
      textBaseline: "middle",
    }),
  }),
];

const createFeature = (item, layerId, config) => {
  const hexCoords = h3.cellToBoundary(item.h3_index, true);
  const coordinates = [hexCoords.map(([lng, lat]) => fromLonLat([lng, lat]))];
  const feature = new Feature({ geometry: new Polygon(coordinates) });

  const value = item[layerId];
  if (!value || !config) return null;

  const [r, g, b] = getColorForValue(value, config);
  feature.set(layerId, value);
  feature.set("color", `rgba(${r}, ${g}, ${b})`);
  feature.set("geobin", item.h3_index);
  feature.set("text", typeof value === "number" ? value.toFixed(2).toString() : String(value));
  feature.set("textStyle", DEFAULT_FEATURE_STYLE);

  return feature;
};

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

// Search options component
const SearchOptions = () => {
  const baseOptions = [
    {
      id: "vpi_analysis",
      label: "Add VPI Analysis",
      description: VISUALIZATION_CONFIGS.vpi_analysis.description,
      category: VISUALIZATION_CONFIGS.vpi_analysis.category,
    },
    ...SPECIAL_LAYERS.map((id) => ({
      id,
      label: `Add ${id
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} Layer`,
      description: VISUALIZATION_CONFIGS[id]?.description || `Add ${id} layer to map`,
      category: VISUALIZATION_CONFIGS[id]?.category || "coverage",
    })),
    ...NQES_CHARTS,
  ];

  const metricOptions = Object.entries(metricConfigs).map(([id, config]) => ({
    id,
    label: `Add ${config.label}`,
    description: VISUALIZATION_CONFIGS[id]?.description || `Add ${config.label} layer to map`,
    category: VISUALIZATION_CONFIGS[id]?.category || config.category || "ug",
  }));

  return [...baseOptions, ...metricOptions];
};

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
  const { updateChartVisibility, setVPIData, fetchNQESData } = useInsights();
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);
  const searchOptions = SearchOptions();

  const handleNQESCharts = useCallback(
    async (chartId) => {
      try {
        const kpiName = NQES_KPI_MAPPING[chartId];
        if (!kpiName) {
          console.error("No KPI mapping found for chart:", chartId);
          return;
        }

        console.log("Fetching nQES data for:", {
          chartId,
          kpiName,
          filters: selectedFilters,
        });

        await fetchNQESData({
          market: selectedFilters.market?.value || "0",
          gnbId: selectedFilters.gnodeb?.value || "00000001",
          sector: selectedFilters.sector?.value || "1",
          carrier: "1",
          startDate:
            selectedFilters.dateRange?.startDate?.toISOString().split("T")[0] || "2024-01-01",
          endDate: selectedFilters.dateRange?.endDate?.toISOString().split("T")[0] || "2024-01-03",
          kpiName: kpiName,
        });

        // Find the corresponding chart configuration
        const chartConfig = NQES_CHARTS.find((chart) => chart.id === chartId);
        if (chartConfig) {
          console.log("Making chart visible:", chartConfig.label);
          // Use the exact chart title from the configuration
          updateChartVisibility(chartConfig.label, true);
        } else {
          console.error("Chart configuration not found for:", chartId);
        }
      } catch (error) {
        console.error("Error in handleNQESCharts:", error);
      }
    },
    [selectedFilters, fetchNQESData, updateChartVisibility]
  );

  const handleVPIAnalysis = useCallback(async () => {
    try {
      const response = await api.getVPIData();
      const transformedData = transformVPIData(response);
      setVPIData(transformedData);
      await new Promise((resolve) => setTimeout(resolve, 100));
      updateChartVisibility("VPI Analysis", true);
      updateChartVisibility("Computation Utilization by Band", true);
    } catch (error) {
      console.error("Error fetching VPI data:", error);
    }
  }, [setVPIData, updateChartVisibility]);

  const handleSpecialLayer = useCallback(
    (id) => {
      setAddedLayers((prev) => new Set([...prev, id]));
      setLayerVisibility((prev) => ({ ...prev, [id]: true }));
      if (overlayLayers?.[id]) {
        overlayLayers[id].setVisible(true);
      }
    },
    [setAddedLayers, setLayerVisibility, overlayLayers]
  );

  const handleTruecallLayer = useCallback(
    async (id) => {
      if (!selectedFilters.market || !selectedFilters.gnodeb) {
        console.warn("Market or GNodeB not selected");
        return;
      }

      try {
        const response = await api.getTruecallData({
          market: selectedFilters.market.value,
          gnodeb: selectedFilters.gnodeb.value,
          kpi_name: id,
          startdate: selectedFilters.dateRange.startDate.toISOString().split("T")[0],
          enddate: selectedFilters.dateRange.endDate.toISOString().split("T")[0],
        });

        if (!response || !overlayLayers?.[id]) return;

        const layer = overlayLayers[id];
        const source = layer.getSource();
        if (!source?.clear) return;

        source.clear();
        const features = response
          .map((item) => createFeature(item, id, metricConfigs[id]))
          .filter(Boolean);

        source.addFeatures(features);
        layer.setVisible(true);
        layer.setStyle((feature) => {
          const color = feature.get("color");
          const text = feature.get("text");
          const textStyle = feature.get("textStyle");
          return color ? createFeatureStyle(color, text, textStyle) : null;
        });

        setTimeout(() => {
          const extent = source.getExtent();
          if (extent?.every((coord) => Number.isFinite(coord))) {
            mapInstance.getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 1000,
              maxZoom: 15,
            });
          }
        }, 100);
      } catch (error) {
        console.error("Error fetching Truecall data:", error);
      }
    },
    [selectedFilters, overlayLayers, mapInstance]
  );

  const handleLayerAdd = useCallback(
    (id) => {
      if (!overlayLayers?.[id]) {
        const layer = defaultLayers[id];
        if (layer) {
          layer.setVisible(true);
          mapInstance.addLayer(layer);
          setOverlayLayers((prev) => ({ ...prev, [id]: layer }));
          layer.changed();
        }
      } else if (overlayLayers[id]) {
        overlayLayers[id].setVisible(true);
        overlayLayers[id].changed();
      }
    },
    [overlayLayers, mapInstance, setOverlayLayers]
  );

  const addData = useCallback(
    async (layerId) => {
      const option = searchOptions.find(
        (opt) => opt.id === layerId || opt.label.toLowerCase().includes(layerId.toLowerCase())
      );

      if (!option) {
        console.warn("No matching option found for:", layerId);
        return;
      }

      const { id } = option;

      // Handle nQES charts
      if (id.startsWith("nqes_")) {
        console.log("Handling nQES chart:", id);
        await handleNQESCharts(id);
        setInputValue("");
        return;
      }

      const config = getVisualizationConfig(id);
      let chartTitles;

      // Handle different modes
      switch (config.mode) {
        case "chart":
          await handleVPIAnalysis();
          break;

        case "chartandmap":
          setAddedLayers((prev) => new Set([...prev, id]));
          setLayerVisibility((prev) => ({ ...prev, [id]: true }));
          setSelectedMetric(id);
          handleLayerAdd(id);

          chartTitles = getChartTitles(id);
          chartTitles.forEach((title) => updateChartVisibility(title));
          break;

        case "map":
          if (SPECIAL_LAYERS.includes(id)) {
            handleSpecialLayer(id);
          } else if (Object.keys(truecallParameters).includes(id)) {
            await handleTruecallLayer(id);
          }
          setAddedLayers((prev) => new Set([...prev, id]));
          setLayerVisibility((prev) => ({ ...prev, [id]: true }));
          setSelectedMetric(id);
          handleLayerAdd(id);
          break;

        default:
          console.warn("Unknown visualization mode:", config.mode);
          return;
      }

      setInputValue("");
    },
    [
      searchOptions,
      handleVPIAnalysis,
      handleSpecialLayer,
      handleTruecallLayer,
      handleLayerAdd,
      handleNQESCharts,
      setAddedLayers,
      setLayerVisibility,
      setSelectedMetric,
      updateChartVisibility,
    ]
  );

  const handleOptionSelect = (event, option) => {
    if (option) {
      setSelectedOption(option);
      setOpenConfirm(true);
    }
  };

  const getVisualizationModeForOption = (option) => {
    if (option.id.startsWith("nqes_")) {
      return NQES_VISUALIZATION_CONFIG;
    }
    return getVisualizationConfig(option.id);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      addData(selectedOption.id);
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
        <DialogTitle>
          {selectedOption && getVisualizationModeForOption(selectedOption).mode === "chart"
            ? "Add Chart"
            : "Add Layer"}
        </DialogTitle>
        <DialogContent>
          {selectedOption?.description || "Are you sure you want to add this visualization?"}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCancel} variant="outlined" color="dark">
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirm} variant="outlined" color="dark">
            {selectedOption && getVisualizationModeForOption(selectedOption).mode === "chart"
              ? "Add Chart"
              : "Add Layer"}
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
