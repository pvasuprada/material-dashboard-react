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

import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Add these imports at the top with other imports
import { dashboardData } from "layouts/dashboard/data/dashboardData";
import { useInsights } from "context/insightsContext";
import MDAutocomplete from "components/MDAutocomplete";
import MDDateRangePicker from "components/MDDateRangePicker";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const [activeSection, setActiveSection] = useState("dashboards");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  useEffect(() => {
    const handleSectionChange = (event) => {
      setActiveSection(event.detail);
    };

    window.addEventListener("sidenavSectionChange", handleSectionChange);
    return () => window.removeEventListener("sidenavSectionChange", handleSectionChange);
  }, []);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  // Create separate route renderers for each section
  const renderFilterSection = () => {
    const marketOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const sectorOptions = ["115", "116", "117", "118"];

    return (
      <>
        <MDTypography
          color={textColor}
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
              options={marketOptions}
              label="Market"
              color={textColor === "white" ? "light" : "dark"}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDAutocomplete
              size="small"
              options={sectorOptions}
              label="Sector"
              color={textColor === "white" ? "light" : "dark"}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDDateRangePicker size="small" color={textColor === "white" ? "light" : "dark"} />
          </MDBox>
          <MDBox display="flex" gap={1}>
            <MDButton variant="outlined" color="secondary" size="small" fullWidth>
              Reset
            </MDButton>
            <MDButton variant="gradient" color="info" size="small" fullWidth>
              Apply
            </MDButton>
          </MDBox>
        </MDBox>
      </>
    );
  };

  const renderInsightsSection = () => {
    const { dashboardData, updateInsightVisibility, chartsData, updateChartVisibility } =
      useInsights();

    return (
      <>
        <MDTypography
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          Statistics Insights
        </MDTypography>
        <MDBox px={3} py={1}>
          <FormGroup>
            {dashboardData.statistics.map((stat) => (
              <FormControlLabel
                key={stat.title}
                control={
                  <Switch
                    size="small"
                    checked={stat.visible}
                    onChange={(e) => updateInsightVisibility(stat.title, e.target.checked)}
                    sx={{
                      "& .MuiSwitch-track": {
                        backgroundColor: textColor === "white" ? "#ffffff40" : "#00000040",
                      },
                      "& .MuiSwitch-thumb": {
                        backgroundColor: textColor,
                      },
                    }}
                  />
                }
                label={
                  <MDTypography variant="button" color={textColor}>
                    {stat.title}
                  </MDTypography>
                }
              />
            ))}
          </FormGroup>
        </MDBox>

        <Divider
          sx={{
            my: 2,
            backgroundColor: textColor === "white" ? "#ffffff40" : "#00000040",
          }}
        />

        <MDTypography
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          Charts Insights
        </MDTypography>
        <MDBox px={3} py={1}>
          <FormGroup>
            {chartsData.charts.map((chart) => (
              <FormControlLabel
                key={chart.title}
                control={
                  <Switch
                    size="small"
                    checked={chart.visible}
                    onChange={(e) => updateChartVisibility(chart.title, e.target.checked)}
                    sx={{
                      "& .MuiSwitch-track": {
                        backgroundColor: textColor === "white" ? "#ffffff40" : "#00000040",
                      },
                      "& .MuiSwitch-thumb": {
                        backgroundColor: textColor,
                      },
                    }}
                  />
                }
                label={
                  <MDTypography variant="button" color={textColor}>
                    {chart.title}
                  </MDTypography>
                }
              />
            ))}
          </FormGroup>
        </MDBox>
      </>
    );
  };

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      <List>
        {activeSection === "dashboards" && renderRoutes}
        {activeSection === "filters" && renderFilterSection()}
        {activeSection === "insights" && renderInsightsSection()}
      </List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
