import { Box, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { metricConfigs } from "../config/layers";

const LegendContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(0.5),
  "& .legend-swatch": {
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
  },
  "& .legend-icon": {
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
    objectFit: "contain",
  },
  "& .MuiTypography-caption": {
    color: theme.palette.text.primary,
  },
}));

// Default color ranges for dynamic visualization
const DEFAULT_COLOR_RANGES = {
  standard: {
    low: { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
    medium: { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
    high: { color: "rgba(0, 255, 0, 0.8)", label: "High" },
  },
  inverse: {
    low: { color: "rgba(0, 255, 0, 0.8)", label: "Low" },
    medium: { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
    high: { color: "rgba(255, 0, 0, 0.8)", label: "High" },
  },
};

// Special layer configurations
const SPECIAL_LAYER_CONFIGS = {
  sites_layer: [
    {
      icon: "/sector360/towericon.png",
      label: "Site Location",
      iconSize: "20px",
    },
  ],
  raw_coverage: [
    {
      color: "rgba(255, 165, 0, 0.4)",
      label: "Raw Coverage Area",
      borderColor: "rgba(255, 165, 0, 1)",
      borderWidth: 2,
    },
  ],
  interpolation: [
    { color: "rgba(255, 0, 0, 0.8)", label: "Poor Signal (-140 dBm)" },
    { color: "rgba(255, 255, 0, 0.8)", label: "Medium Signal (-105 dBm)" },
    { color: "rgba(0, 255, 0, 0.8)", label: "Good Signal (-70 dBm)" },
  ],
  population: [
    { color: "rgba(255, 0, 0, 0.8)", label: "Low Population" },
    { color: "rgba(255, 255, 0, 0.8)", label: "Medium Population" },
    { color: "rgba(0, 255, 0, 0.8)", label: "High Population" },
  ],
  population_wms: [
    { color: "rgba(0, 47, 161, 0.8)", label: "0-1000" },
    { color: "rgba(3, 190, 227, 0.8)", label: "1000-2000" },
    { color: "rgba(123, 255, 87, 0.8)", label: "2000-3000" },
    { color: "rgba(255, 184, 0, 0.8)", label: "3000-4000" },
    { color: "rgba(236, 0, 0, 0.8)", label: "4000+" },
  ],
};

const Legend = ({ layer, expanded }) => {
  const getLegendContent = () => {
    // Check for special layer configurations first
    if (SPECIAL_LAYER_CONFIGS[layer.id]) {
      return SPECIAL_LAYER_CONFIGS[layer.id];
    }

    // Check for metric configurations
    const config = metricConfigs[layer.id];
    if (!config?.visualization) {
      return null;
    }

    switch (config.visualization.type) {
      case "dynamic": {
        const { minColor, midColor, maxColor, inverse } = config.visualization;
        return [
          {
            color: `rgba(${minColor[0]}, ${minColor[1]}, ${minColor[2]}, 0.8)`,
            label: inverse ? "High" : "Low",
          },
          {
            color: `rgba(${midColor[0]}, ${midColor[1]}, ${midColor[2]}, 0.8)`,
            label: "Medium",
          },
          {
            color: `rgba(${maxColor[0]}, ${maxColor[1]}, ${maxColor[2]}, 0.8)`,
            label: inverse ? "Low" : "High",
          },
        ];
      }

      case "classbreak":
        return config.visualization.breaks.map((break_) => ({
          color: `rgba(${break_.color[0]}, ${break_.color[1]}, ${break_.color[2]}, 0.8)`,
          label: break_.label,
        }));

      case "category":
        return config.visualization.categories.map((cat) => ({
          color: `rgba(${cat.color[0]}, ${cat.color[1]}, ${cat.color[2]}, 0.8)`,
          label: cat.label,
        }));

      default:
        // Use standard color range for metrics without specific visualization
        return DEFAULT_COLOR_RANGES[config.inverse ? "inverse" : "standard"];
    }
  };

  const legendItems = getLegendContent();
  if (!legendItems) return null;

  return (
    <Collapse in={expanded}>
      <LegendContainer>
        {legendItems.map((item, index) => (
          <LegendItem key={index}>
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.label}
                className="legend-icon"
                style={{
                  width: item.iconSize || "20px",
                  height: item.iconSize || "20px",
                }}
              />
            ) : (
              <div
                className="legend-swatch"
                style={{
                  backgroundColor: item.color,
                  border: item.borderColor
                    ? `${item.borderWidth || 1}px solid ${item.borderColor}`
                    : undefined,
                }}
              />
            )}
            <Box>
              <Typography variant="caption">{item.label}</Typography>
              {item.description && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {item.description}
                </Typography>
              )}
            </Box>
          </LegendItem>
        ))}
      </LegendContainer>
    </Collapse>
  );
};

export default Legend;
