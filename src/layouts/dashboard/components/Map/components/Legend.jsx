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

const Legend = ({ layer, expanded }) => {
  const getLegendContent = () => {
    // First check if the layer has a visualization config in metricConfigs
    const config = metricConfigs[layer.id];
    if (config?.visualization) {
      switch (config.visualization.type) {
        case "dynamic": {
          // For dynamic, show a gradient from min to max
          const minColor = config.visualization.minColor;
          const midColor = config.visualization.midColor;
          const maxColor = config.visualization.maxColor;
          return [
            {
              color: `rgba(${minColor[0]}, ${minColor[1]}, ${minColor[2]}, 0.8)`,
              label: config.visualization.inverse ? "High" : "Low",
            },
            {
              color: `rgba(${midColor[0]}, ${midColor[1]}, ${midColor[2]}, 0.8)`,
              label: "Medium",
            },
            {
              color: `rgba(${maxColor[0]}, ${maxColor[1]}, ${maxColor[2]}, 0.8)`,
              label: config.visualization.inverse ? "Low" : "High",
            },
          ];
        }
        case "classbreak": {
          // For classbreak, show each break point
          return config.visualization.breaks.map((break_) => ({
            color: `rgba(${break_.color[0]}, ${break_.color[1]}, ${break_.color[2]}, 0.8)`,
            label: break_.label,
          }));
        }
        case "category": {
          // For category, show each category
          return config.visualization.categories.map((cat) => ({
            color: `rgba(${cat.color[0]}, ${cat.color[1]}, ${cat.color[2]}, 0.8)`,
            label: cat.label,
          }));
        }
      }
    }

    // Fallback to original switch case for layers without visualization config
    switch (layer.id) {
      case "sites_layer":
        return [
          {
            icon: "/sector360/towericon.png",
            label: "Site Location",
            iconSize: "20px",
          },
        ];
      case "raw_coverage":
        return [
          {
            color: "rgba(255, 165, 0, 0.4)",
            label: "Raw Coverage Area",
            borderColor: "rgba(255, 165, 0, 1)",
            borderWidth: 2,
          },
        ];
      case "interpolation":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Poor Signal (-140 dBm)" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Signal (-105 dBm)" },
          { color: "rgba(0, 255, 0, 0.8)", label: "Good Signal (-70 dBm)" },
        ];
      case "population":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low Population" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Population" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High Population" },
        ];
      case "population_wms":
        return [
          { color: "rgba(0, 47, 161, 0.8)", label: "0-1000" },
          { color: "rgba(3, 190, 227, 0.8)", label: "1000-2000" },
          { color: "rgba(123, 255, 87, 0.8)", label: "2000-3000" },
          { color: "rgba(255, 184, 0, 0.8)", label: "3000-4000" },
          { color: "rgba(236, 0, 0, 0.8)", label: "4000+" },
        ];
      case "coverage_capacity":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low Signal" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Signal" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High Signal" },
        ];
      case "user_count":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "avg_dl_latency":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "total_dl_volume":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "avg_nr_dl_colume_share":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "avg_nr_rsrp":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "avg_nr_ul_volume_share":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "dl_connections_count":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "p10_dl_speed":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "p10_ul_speed":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "p50_dl_speed":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "p50_ul_speed":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "total_ul_volume":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "ul_connections_count":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High" },
        ];
      case "rec_cnt":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low Count" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Count" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High Count" },
        ];
      case "erab_drop_pct":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "High Drop Rate" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Drop Rate" },
          { color: "rgba(0, 255, 0, 0.8)", label: "Low Drop Rate" },
        ];
      case "volte_erab_drop_pct":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "High Drop Rate" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Drop Rate" },
          { color: "rgba(0, 255, 0, 0.8)", label: "Low Drop Rate" },
        ];
      case "in_avg_rsrq_db":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Poor RSRQ" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium RSRQ" },
          { color: "rgba(0, 255, 0, 0.8)", label: "Good RSRQ" },
        ];
      case "in_num_of_rrc_connection_attempts":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low Attempts" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Attempts" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High Attempts" },
        ];
      case "in_num_of_drops":
        return [
          { color: "rgba(0, 255, 0, 0.8)", label: "Low Drops" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Drops" },
          { color: "rgba(255, 0, 0, 0.8)", label: "High Drops" },
        ];
      case "in_sum_rlc_pdu_dl_volume_md":
        return [
          { color: "rgba(255, 0, 0, 0.8)", label: "Low Volume" },
          { color: "rgba(255, 255, 0, 0.8)", label: "Medium Volume" },
          { color: "rgba(0, 255, 0, 0.8)", label: "High Volume" },
        ];
      default:
        return null;
    }
  };

  const legendItems = getLegendContent();

  if (legendItems === null) return null;

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
