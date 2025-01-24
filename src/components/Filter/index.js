import { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAutocomplete from "components/MDAutocomplete";
import MDDateRangePicker from "components/MDDateRangePicker";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useFilterData } from "hooks/useFilterData";

function Filter() {
  const [market, setMarket] = useState(null);
  const [sector, setSector] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { markets, sectors, loading, error } = useFilterData();

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
  };

  if (loading) {
    return (
      <Card sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Card>
    );
  }

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
              options={markets}
              label="Market"
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MDAutocomplete
              value={sector}
              onChange={(event, newValue) => setSector(newValue)}
              options={sectors}
              label="Sector"
              color="info"
            />
          </Grid>
          <Grid item xs={12}>
            <MDDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(newValue) => setStartDate(newValue)}
              onEndDateChange={(newValue) => setEndDate(newValue)}
              color="info"
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
