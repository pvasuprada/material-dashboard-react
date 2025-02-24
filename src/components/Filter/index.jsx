import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAutocomplete from "components/MDAutocomplete";
import MDDatePicker from "components/MDDatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import {
  fetchInitialOptions,
  fetchSectors,
  fetchFilteredData,
  updateSelectedFilters,
  resetFilters,
} from "store/slices/filterSlice";
import { useMaterialUIController } from "context";

function Filter() {
  const dispatch = useDispatch();
  const [controller] = useMaterialUIController();
  const { sidenavColor, darkMode } = controller;
  const { data, selectedFilters, loading, error } = useSelector((state) => state.filter);

  const [market, setMarket] = useState(selectedFilters.market);
  const [gnodeb, setGnodeb] = useState(selectedFilters.gnodeb);
  const [sector, setSector] = useState(selectedFilters.sector);
  const [trafficType, setTrafficType] = useState(selectedFilters.trafficType);
  const [startDate, setStartDate] = useState(
    dayjs(selectedFilters.dateRange.startDate || new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(dayjs(selectedFilters.dateRange.endDate || new Date()));
  const [isFiltersChanged, setIsFiltersChanged] = useState(false);

  useEffect(() => {
    dispatch(fetchInitialOptions());
  }, [dispatch]);

  useEffect(() => {
    if (gnodeb) {
      dispatch(fetchSectors(gnodeb));
    }
  }, [dispatch, gnodeb]);

  useEffect(() => {
    const hasChanged =
      market !== selectedFilters.market ||
      gnodeb?.value !== selectedFilters.gnodeb?.value ||
      sector !== selectedFilters.sector ||
      trafficType !== selectedFilters.trafficType ||
      !startDate.isSame(dayjs(selectedFilters.dateRange.startDate)) ||
      !endDate.isSame(dayjs(selectedFilters.dateRange.endDate));

    setIsFiltersChanged(hasChanged);
  }, [market, gnodeb, sector, trafficType, startDate, endDate, selectedFilters]);

  const handleReset = () => {
    dispatch(resetFilters());
    setMarket(null);
    setGnodeb(null);
    setSector(null);
    setTrafficType("FWA");
    setStartDate(dayjs(new Date().setMonth(new Date().getMonth() - 1)));
    setEndDate(dayjs(new Date()));
  };

  const handleApply = async () => {
    const newFilters = {
      market,
      gnodeb,
      sector,
      trafficType,
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

  if (error) {
    return (
      <MDBox px={2} py={1}>
        <MDTypography variant="caption" color="error" display="flex" alignItems="center" gap={1}>
          <Icon fontSize="small">error</Icon>
          {error}
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      <MDBox px={2} py={1}>
        <MDTypography
          color={darkMode ? "white" : "dark"}
          variant="caption"
          fontWeight="medium"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            opacity: 0.9,
          }}
        >
          <Icon fontSize="small">filter_list</Icon>
          FILTERS
        </MDTypography>
      </MDBox>

      <Divider sx={{ 
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", 
        my: 1 
      }} />

      <MDBox px={2} py={0.5}>
        <MDBox mb={1.5}>
          <MDAutocomplete
            size="small"
            value={market}
            onChange={(event, newValue) => setMarket(newValue)}
            options={data.markets || []}
            getOptionLabel={(option) => option?.text || ""}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            label="Market"
            color={darkMode ? "white" : "dark"}
            loading={loading}
          />
        </MDBox>
        <MDBox mb={1.5}>
          <MDAutocomplete
            size="small"
            value={gnodeb}
            onChange={(event, newValue) => {
              setGnodeb(newValue);
              setSector(null);
            }}
            options={data.gnodebs || []}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            label="GNODEB"
            color={darkMode ? "white" : "dark"}
            loading={loading}
          />
        </MDBox>
        <MDBox mb={1.5}>
          <MDAutocomplete
            size="small"
            value={sector}
            onChange={(event, newValue) => setSector(newValue)}
            options={data.sectors || []}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            label="Sector"
            color={darkMode ? "white" : "dark"}
            loading={loading}
            disabled={!gnodeb}
          />
        </MDBox>
        <MDBox mb={1.5}>
          <MDAutocomplete
            size="small"
            value={trafficType}
            onChange={(event, newValue) => setTrafficType(newValue)}
            options={data.trafficTypes || []}
            label="Traffic Type"
            color={darkMode ? "white" : "dark"}
            loading={loading}
          />
        </MDBox>
        <MDBox mb={1.5}>
          <MDBox mb={1.5}>
            <MDDatePicker
              input={{
                label: "Start Date",
                size: "small",
              }}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={endDate}
              disabled={loading}
              color={darkMode ? "white" : "dark"}
            />
          </MDBox>
          <MDBox>
            <MDDatePicker
              input={{
                label: "End Date",
                size: "small",
              }}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate}
              disabled={loading}
              color={darkMode ? "white" : "dark"}
            />
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider sx={{ 
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", 
        my: 1 
      }} />

      <MDBox px={2} py={1} display="flex" gap={1}>
        <MDButton
          variant="text"
          color={darkMode ? "light" : "dark"}
          size="small"
          onClick={handleReset}
          disabled={loading}
          sx={{ minWidth: "auto", p: 1 }}
        >
          <Tooltip title="Reset filters">
            <Icon>restart_alt</Icon>
          </Tooltip>
        </MDButton>
        <MDButton
          variant="gradient"
          color={sidenavColor}
          size="small"
          onClick={handleApply}
          disabled={loading || !isFiltersChanged}
          fullWidth
          sx={{
            py: 1,
            opacity: isFiltersChanged ? 1 : 0.7,
          }}
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : "Apply Filters"}
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

export default Filter;
