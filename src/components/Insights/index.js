import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useInsights } from "context/insightsContext";

function Insights() {
  const { dashboardData, updateInsightVisibility } = useInsights();

  return (
    <Card sx={{ p: 2 }}>
      <MDTypography variant="h6" gutterBottom>
        Network Insights
      </MDTypography>
      <FormGroup>
        {dashboardData.statistics.map((stat) => (
          <FormControlLabel
            key={stat.title}
            control={
              <Switch
                checked={stat.visible}
                onChange={(e) => updateInsightVisibility(stat.title, e.target.checked)}
              />
            }
            label={stat.title}
          />
        ))}
      </FormGroup>
    </Card>
  );
}

export default Insights;
