import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import { api } from "services/api";
import { updateGridConfig } from "store/slices/gridDataSlice";
import { fetchFilteredData } from "store/slices/filterSlice";
import {
  updateMapView,
  setSelectedLocation,
  addSelectedSite,
  removeSelectedSite,
  selectSelectedSites,
} from "store/slices/mapSlice";

function SiteGrid({ isEmbedded = false }) {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(null);
  const gridRef = useRef(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Replace local state with Redux state
  const { gridData, loading } = useSelector((state) => state.grid);
  const gridConfig = useSelector((state) => state.grid.gridConfig);
  const selectedSites = useSelector(selectSelectedSites);

  // Filter data based on showSelectedOnly
  const filteredData = showSelectedOnly
    ? gridData.filter((site) => selectedSites.some((selected) => selected.nwfid === site.nwfid))
    : gridData;

  const handleRowClick = (rowData) => {
    const longitude = parseFloat(rowData.longitude);
    const latitude = parseFloat(rowData.latitude);

    if (!isNaN(longitude) && !isNaN(latitude)) {
      // Check if the site is already selected
      const isSelected = selectedSites.some((site) => site.nwfid === rowData.nwfid);

      if (!isSelected) {
        // Add to selected sites
        dispatch(addSelectedSite(rowData));

        // If it's the only selected site, zoom to it
        if (selectedSites.length === 0) {
          dispatch(
            updateMapView({
              center: [longitude, latitude],
              zoom: 13,
            })
          );
        } else {
          // Calculate extent of all selected sites
          const sites = [...selectedSites, rowData];
          const lngs = sites.map((site) => parseFloat(site.longitude));
          const lats = sites.map((site) => parseFloat(site.latitude));

          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          // Add padding to the extent
          const lngPadding = (maxLng - minLng) * 0.1;
          const latPadding = (maxLat - minLat) * 0.1;

          dispatch(
            updateMapView({
              center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
              zoom: Math.min(
                13,
                calculateZoomLevel(
                  minLng - lngPadding,
                  maxLng + lngPadding,
                  minLat - latPadding,
                  maxLat + latPadding
                )
              ),
            })
          );
        }
      }
    }
  };

  const handleChipDelete = (nwfid) => {
    dispatch(removeSelectedSite(nwfid));
  };

  // Helper function to calculate appropriate zoom level
  const calculateZoomLevel = (minLng, maxLng, minLat, maxLat) => {
    const lngDiff = maxLng - minLng;
    const latDiff = maxLat - minLat;
    const maxDiff = Math.max(lngDiff, latDiff);

    // This is a simple approximation - adjust these values based on your needs
    if (maxDiff > 5) return 5;
    if (maxDiff > 2) return 7;
    if (maxDiff > 1) return 9;
    if (maxDiff > 0.5) return 11;
    return 13;
  };

  const siteData = {
    columns:
      gridData.length > 0
        ? Object.keys(gridData[0]).map((key) => ({
            Header: key.toUpperCase(),
            accessor: key,
            align: typeof gridData[0][key] === "number" ? "right" : "left",
          }))
        : [],
    rows: gridData.map((site) => ({
      ...site,
      latitude: parseFloat(site.latitude).toFixed(4),
      longitude: parseFloat(site.longitude).toFixed(4),
      clickEvent: () => handleRowClick(site),
    })),
  };

  const handleExportCSV = async () => {
    try {
      const blob = await api.exportSiteDataToCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sites_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      closeMenu();
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchFilteredData());
    closeMenu();
  };

  const handleFullscreen = () => {
    const gridElement = gridRef.current;
    if (!document.fullscreenElement) {
      if (gridElement.requestFullscreen) {
        gridElement.requestFullscreen();
      } else if (gridElement.webkitRequestFullscreen) {
        gridElement.webkitRequestFullscreen();
      } else if (gridElement.msRequestFullscreen) {
        gridElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    closeMenu();
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={handleRefresh}>Refresh Data</MenuItem>
      {/* <MenuItem onClick={handleExportCSV}>Export to CSV</MenuItem>
      <MenuItem onClick={closeMenu}>Filter Sites</MenuItem> */}
      <MenuItem onClick={handleFullscreen}>View Full Screen</MenuItem>
    </Menu>
  );

  if (loading) {
    return (
      <Card sx={isEmbedded ? { boxShadow: "none", borderRadius: 0 } : {}}>
        <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={isEmbedded ? { boxShadow: "none", borderRadius: 0 } : {}}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={isEmbedded ? 1 : 2}
        pl={2}
        pr={2}
      >
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Site Grid
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showSelectedOnly}
                onChange={(e) => setShowSelectedOnly(e.target.checked)}
                color="info"
                size="small"
              />
            }
            label={
              <MDTypography variant="button" fontWeight="regular" color="text">
                Selected Only
              </MDTypography>
            }
          />
          {!isEmbedded && (
            <MDBox color="text" px={2}>
              <Icon
                sx={{ cursor: "pointer", fontWeight: "bold" }}
                fontSize="small"
                onClick={openMenu}
              >
                more_vert
              </Icon>
            </MDBox>
          )}
        </MDBox>
        {renderMenu}
      </MDBox>

      {/* Selected Sites Chips */}
      {selectedSites.length > 0 && (
        <MDBox px={2} py={isEmbedded ? 0.5 : 1}>
          <Box display="flex" gap={1} flexWrap="wrap">
            {selectedSites.map((site) => (
              <Chip
                key={site.nwfid}
                label={`NWFID: ${site.nwfid}`}
                onDelete={() => handleChipDelete(site.nwfid)}
                color="info"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </MDBox>
      )}

      <MDBox>
        <DataTable
          table={{
            columns: siteData.columns,
            rows: filteredData.map((site) => ({
              ...site,
              latitude: parseFloat(site.latitude).toFixed(4),
              longitude: parseFloat(site.longitude).toFixed(4),
              clickEvent: () => handleRowClick(site),
            })),
          }}
          showTotalEntries={!isEmbedded}
          isSorted={true}
          noEndBorder
          entriesPerPage={gridConfig.pageSize}
          canSearch={!isEmbedded}
          pagination={{ variant: "contained", color: "info" }}
          entriesPerPageText="Entries per page:"
          searchPlaceholder="Search sites..."
          onPageChange={(page) => dispatch(updateGridConfig({ currentPage: page }))}
          onRowsPerPageChange={(newPageSize) =>
            dispatch(updateGridConfig({ pageSize: newPageSize }))
          }
          onRowClick={handleRowClick}
          selectedRows={selectedSites.map((site) => site.nwfid)}
          sx={{
            "& .MuiInputBase-input": {
              color: "text.main",
            },
            "& .MuiTypography-root": {
              color: "text.main",
            },
            "& .MuiTablePagination-root": {
              color: "text.main",
            },
            "& .MuiSelect-icon": {
              color: "text.main",
            },
            "& .MuiTableRow-root": {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              },
            },
          }}
        />
      </MDBox>
    </Card>
  );
}

SiteGrid.propTypes = {
  isEmbedded: PropTypes.bool,
};

export default SiteGrid;
