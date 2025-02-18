import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import MDTypography from "components/MDTypography";

function ChartsSelection({ darkMode, sidenavColor, chartsData, updateChartVisibility }) {
  return (
    <>
      <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mt={2}>
        Charts
      </MDTypography>
      <FormGroup>
        {chartsData.map((chart) => (
          <FormControlLabel
            key={chart.title}
            control={
              <Switch
                color={sidenavColor}
                checked={chart.visible}
                onChange={() => updateChartVisibility(chart.title)}
                name={chart.title}
                size="small"
              />
            }
            label={
              <MDTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
                {chart.title}
              </MDTypography>
            }
          />
        ))}
      </FormGroup>
    </>
  );
}

export default ChartsSelection; 