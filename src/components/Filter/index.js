import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAutocomplete from "components/MDAutocomplete";
import MDDateRangePicker from "components/MDDateRangePicker";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchFilterOptions,
  fetchFilteredData,
  updateSelectedFilters,
  resetFilters,
} from "store/slices/filterSlice";
import { useMaterialUIController } from "context";

function Filter() {
  const dispatch = useDispatch();
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;
  const { data, selectedFilters, loading, error } = useSelector((state) => state.filter);

  const [market, setMarket] = useState(selectedFilters.market);
  const [sector, setSector] = useState(selectedFilters.sector);
  const [startDate, setStartDate] = useState(
    dayjs(selectedFilters.dateRange.startDate || new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(dayjs(selectedFilters.dateRange.endDate || new Date()));

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  const handleReset = () => {
    dispatch(resetFilters());
    setMarket("all");
    setSector("all");
    setStartDate(dayjs(new Date().setMonth(new Date().getMonth() - 1)));
    setEndDate(dayjs(new Date()));
  };

  const handleApply = async () => {
    const newFilters = {
      market,
      sector,
      dateRange: {
        startDate,
        endDate,
      },
    };

    dispatch(updateSelectedFilters(newFilters));

    try {
      await dispatch(fetchFilteredData(newFilters)).unwrap();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  if (loading) {
    return (
      <MDBox px={3} py={1} display="flex" justifyContent="center">
        <CircularProgress size={24} color={sidenavColor} />
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox px={3} py={1}>
        <MDTypography variant="caption" color="error">
          {error}
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <>
      <MDTypography
        color="white"
        display="block"
        variant="caption"
        fontWeight="bold"
        textTransform="uppercase"
        pl={3}
        mt={2}
        mb={1}
        ml={1}
      >
        Filter Options
      </MDTypography>
      <MDBox px={3} py={1}>
        <MDBox mb={2}>
          <MDAutocomplete
            size="small"
            value={market}
            onChange={(event, newValue) => setMarket(newValue)}
            options={data.markets || []}
            label="Market"
            color="white"
          />
        </MDBox>
        <MDBox mb={2}>
          <MDAutocomplete
            size="small"
            value={sector}
            onChange={(event, newValue) => setSector(newValue)}
            options={data.sectors || []}
            label="Sector"
            color="white"
          />
        </MDBox>
        <MDBox mb={2}>
          <MDDateRangePicker
            size="small"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(newValue) => setStartDate(newValue)}
            onEndDateChange={(newValue) => setEndDate(newValue)}
            color="white"
          />
        </MDBox>
        <MDBox display="flex" gap={1}>
          <MDButton
            variant="outlined"
            color="light.main"
            size="small"
            fullWidth
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </MDButton>
          <MDButton
            variant="gradient"
            color={sidenavColor}
            size="small"
            fullWidth
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply"}
          </MDButton>
        </MDBox>
      </MDBox>
    </>
  );
}

export default Filter;
