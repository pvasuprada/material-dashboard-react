import { Box, Collapse, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const LegendContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(0.5),
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
}));

const Legend = ({ layer, expanded }) => {
  const getLegendItems = () => {
    switch (layer.id) {
      case "coverage_capacity":
        return [
          { color: "rgba(139, 69, 19, 0.2)", label: "Low Signal (RSRP < 20)" },
          { color: "rgba(139, 69, 19, 0.5)", label: "Medium Signal (RSRP 20-50)" },
          { color: "rgba(139, 69, 19, 0.8)", label: "High Signal (RSRP > 50)" },
        ];
      case "hexbins":
        return [
          { color: "rgba(255, 0, 0, 0.2)", label: "Low Density" },
          { color: "rgba(255, 0, 0, 0.5)", label: "Medium Density" },
          { color: "rgba(255, 0, 0, 0.8)", label: "High Density" },
        ];
      case "hurricanes":
        return [
          { color: "#ff0000", label: "Category 5" },
          { color: "#ff6600", label: "Category 4" },
          { color: "#ffcc00", label: "Category 3" },
          { color: "#ffff00", label: "Category 2" },
          { color: "#99ff00", label: "Category 1" },
        ];
      default:
        return [];
    }
  };

  const legendItems = getLegendItems();

  if (legendItems.length === 0) return null;

  return (
    <Collapse in={expanded}>
      <LegendContainer>
        {legendItems.map((item, index) => (
          <LegendItem key={index}>
            <div
              className="legend-swatch"
              style={{ backgroundColor: item.color }}
            />
            <Typography variant="caption">{item.label}</Typography>
          </LegendItem>
        ))}
      </LegendContainer>
    </Collapse>
  );
};

export default Legend; 