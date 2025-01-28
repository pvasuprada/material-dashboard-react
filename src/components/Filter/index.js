import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAutocomplete from "components/MDAutocomplete";
import MDDateRangePicker from "components/MDDateRangePicker";
import {
  fetchFilterOptions,
  fetchFilteredData,
  updateSelectedFilters,
  resetFilters,
} from "store/slices/filterSlice";

function Filter() {
  const dispatch = useDispatch();
  const { data, selectedFilters, loading, error } = useSelector((state) => state.filter);

  const [market, setMarket] = useState(selectedFilters.market);
  const [sector, setSector] = useState(selectedFilters.sector);
  const [startDate, setStartDate] = useState(selectedFilters.dateRange.startDate);
  const [endDate, setEndDate] = useState(selectedFilters.dateRange.endDate);

  // Fetch filter options on component mount
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  const handleReset = () => {
    dispatch(resetFilters());
    setMarket("all");
    setSector("all");
    setStartDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    setEndDate(new Date());
  };

  const handleApply = () => {
    const newFilters = {
      market,
      sector,
      dateRange: {
        startDate,
        endDate,
      },
    };

    // First update the selected filters in the store
    dispatch(updateSelectedFilters(newFilters));

    // Then fetch the filtered data
    dispatch(fetchFilteredData(newFilters));
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
              options={data.markets}
              label="Market"
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MDAutocomplete
              value={sector}
              onChange={(event, newValue) => setSector(newValue)}
              options={data.sectors}
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
