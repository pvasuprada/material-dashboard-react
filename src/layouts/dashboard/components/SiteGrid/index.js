/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

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

function SiteGrid() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState({ columns: [], rows: [] });

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:2024/minerva-service/dynamic-query-executor/sector-360/sites-mv",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            market: "131",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Transform data for DataTable
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]).map((key) => ({
          Header: key.toUpperCase(),
          accessor: key,
          align: typeof data[0][key] === "number" ? "right" : "left",
        }));

        const rows = data.map((site) => ({
          ...site,
          latitude: parseFloat(site.latitude).toFixed(4),
          longitude: parseFloat(site.longitude).toFixed(4),
        }));

        setSiteData({ columns, rows });
      }
    } catch (error) {
      console.error("Error fetching site data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

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
      <MenuItem onClick={closeMenu}>Refresh Data</MenuItem>
      <MenuItem onClick={closeMenu}>Export to CSV</MenuItem>
      <MenuItem onClick={closeMenu}>Filter Sites</MenuItem>
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
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Site Grid
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
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
          </MDBox>
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
          entriesPerPage={10}
          canSearch={true}
        />
      </MDBox>
    </Card>
  );
}

export default SiteGrid;
