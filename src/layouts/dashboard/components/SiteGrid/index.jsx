import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import { api } from "services/api";
import { updateGridConfig } from "store/slices/gridDataSlice";
import { fetchFilteredData } from "store/slices/filterSlice";
import { updateMapView } from "store/slices/mapSlice";

function SiteGrid() {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(null);
  const gridRef = useRef(null);

  // Replace local state with Redux state
  const { gridData, loading } = useSelector((state) => state.grid);
  const gridConfig = useSelector((state) => state.grid.gridConfig);

  const handleRowClick = (rowData) => {
    const longitude = parseFloat(rowData.longitude);
    const latitude = parseFloat(rowData.latitude);

    if (!isNaN(longitude) && !isNaN(latitude)) {
      dispatch(
        updateMapView({
          center: [longitude, latitude],
          zoom: 13,
        })
      );
    }
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
      <Card>
        <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </MDBox>
      </Card>
    );
  }

  return (
    <Card ref={gridRef}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Site Grid
          </MDTypography>
          {/* <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              cell_tower
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>{siteData.rows.length} sites</strong> found
            </MDTypography>
          </MDBox> */}
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={siteData}
          showTotalEntries={true}
          isSorted={true}
          noEndBorder
          entriesPerPage={gridConfig.pageSize}
          canSearch={true}
          pagination={{ variant: "contained", color: "info" }}
          entriesPerPageText="Entries per page:"
          searchPlaceholder="Search sites..."
          onPageChange={(page) => dispatch(updateGridConfig({ currentPage: page }))}
          onRowsPerPageChange={(newPageSize) =>
            dispatch(updateGridConfig({ pageSize: newPageSize }))
          }
          onRowClick={handleRowClick}
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
            },
          }}
        />
      </MDBox>
    </Card>
  );
}

export default SiteGrid;
