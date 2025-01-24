import { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAutocomplete from "components/MDAutocomplete";
import MDDatePicker from "components/MDDatePicker";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

function Filter() {
  const [market, setMarket] = useState(null);
  const [sector, setSector] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const marketOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sectorOptions = ["115", "116", "117", "118"];

  const handleReset = () => {
    setMarket(null);
    setSector(null);
    setStartDate(null);
    setEndDate(null);
  };

  const handleApply = () => {
    const filters = {
      market,
      sector,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
    console.log("Applied filters:", filters);
    // Add your filter logic here
  };

  return (
    <Card sx={{ p: 2 }}>
      <MDBox>
        <MDTypography variant="h6" gutterBottom>
          Filter Options
        </MDTypography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <MDAutocomplete
              value={market}
              onChange={(event, newValue) => setMarket(newValue)}
              options={marketOptions}
              label="Market"
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MDAutocomplete
              value={sector}
              onChange={(event, newValue) => setSector(newValue)}
              options={sectorOptions}
              label="Sector"
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MDDatePicker
              label="Start"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MDDatePicker
              label="End"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              color="info"
              minDate={startDate}
            />
          </Grid>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={handleReset}>
                Reset
              </MDButton>
              <MDButton variant="gradient" color="info" onClick={handleApply}>
                Apply
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default Filter;
