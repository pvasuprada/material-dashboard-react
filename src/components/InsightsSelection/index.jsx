import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import MDTypography from "components/MDTypography";

function InsightsSelection({ darkMode, sidenavColor, dashboardData, updateInsightVisibility }) {
  return (
    <>
      <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
        Insights
      </MDTypography>
      <FormGroup>
        {dashboardData.statistics.map((stat) => (
          <FormControlLabel
            key={stat.id}
            control={
              <Switch
                color={sidenavColor}
                checked={stat.visible}
                onChange={() => updateInsightVisibility(stat.id)}
                name={stat.title}
                size="small"
              />
            }
            label={
              <MDTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
                {stat.title}
              </MDTypography>
            }
          />
        ))}
      </FormGroup>
    </>
  );
}

export default InsightsSelection; 