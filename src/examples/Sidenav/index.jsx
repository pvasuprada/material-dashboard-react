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
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Switch from "@mui/material/Switch";

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
import { useInsights } from "context/insightsContext";
import MDAutocomplete from "components/MDAutocomplete";
import MDDateRangePicker from "components/MDDateRangePicker";
import Filter from "components/Filter";
import InsightsSelection from "components/InsightsSelection";
import ChartsSelection from "components/ChartsSelection";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const [activeSection, setActiveSection] = useState("dashboards");
  const { dashboardData, updateInsightVisibility, chartsData, updateChartVisibility } =
    useInsights();

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => {
    setMiniSidenav(dispatch, true);
    document.body.style.setProperty("--sidenav-width", "0px");
  };

  const openSidenav = () => {
    setMiniSidenav(dispatch, false);
    document.body.style.setProperty("--sidenav-width", "250px");
  };

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      if (window.innerWidth < 1200) {
        closeSidenav();
      } else {
        openSidenav();
      }
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
    return (
      <>
        <MDBox px={2}>
          <Filter />
        </MDBox>
      </>
    );
  };

  const renderInsightsSection = () => (
    <MDBox pl={3} pr={1} mt={2}>
      <InsightsSelection 
        darkMode={darkMode}
        sidenavColor={sidenavColor}
        dashboardData={dashboardData}
        updateInsightVisibility={updateInsightVisibility}
      />
      <ChartsSelection 
        darkMode={darkMode}
        sidenavColor={sidenavColor}
        chartsData={chartsData}
        updateChartVisibility={updateChartVisibility}
      />
    </MDBox>
  );

  return (
    <>
      {/* Floating chevron button that shows when sidenav is closed */}
      <MDBox
        className="chevron-button"
        sx={{
          position: "fixed",
          left: miniSidenav ? "20px" : "274px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1299,
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          borderRadius: "50%",
          cursor: "pointer",
          p: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            transform: "translateY(-50%) scale(1.1)",
          },
          boxShadow: darkMode ? "0 2px 10px 0 rgba(0,0,0,0.2)" : "0 2px 10px 0 rgba(0,0,0,0.1)",
        }}
        onClick={openSidenav}
      >
        <Icon
          sx={{
            color: darkMode ? "#fff" : "#000",
            fontSize: "24px",
            display: "flex",
          }}
        >
          chevron_right
        </Icon>
      </MDBox>
      <SidenavRoot
        {...rest}
        variant="permanent"
        ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
        sx={{
          ...(miniSidenav && {
            "& .MuiListItem-root": {
              pointerEvents: "auto",
              position: "relative",
              zIndex: 1300,
            },
            "& .MuiCollapse-root": {
              position: "relative",
              zIndex: 1300,
            },
            "& .MuiButtonBase-root": {
              position: "relative",
              zIndex: 1300,
            },
          }),
        }}
      >
        <MDBox pt={3} pb={1} px={4} textAlign="center">
          <MDBox
            display={{ xs: "block", xl: "block" }}
            position="absolute"
            top={0}
            right={0}
            p={1.625}
            onClick={closeSidenav}
            sx={{ cursor: "pointer" }}
          >
            <MDTypography variant="h6" color="secondary">
              <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
            </MDTypography>
          </MDBox>
          <MDBox component={NavLink} to="/" display="flex" alignItems="center">
            {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
            <MDBox
              width={!brandName && "100%"}
              sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
            >
              <MDTypography 
                component="h6" 
                variant="button" 
                fontWeight="medium" 
                color={darkMode ? "white" : "dark"}
              >
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
    </>
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
