import { Box, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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
