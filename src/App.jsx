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

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { InsightsProvider } from "context/insightsContext";
import { SidenavProvider, useSidenav } from "context/SidenavContext";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

// Create default cache
const cache = createCache({
  key: "mui",
});

function AppContent() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { showSidenav, sidenavContent, activeButton } = useSidenav();

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <MDBox
        display="flex"
        sx={{
          overflow: "hidden",
          height: "100vh",
        }}
      >
        {layout === "dashboard" && showSidenav && (
          <MDBox
            sx={{
              position: "fixed",
              height: "100vh",
              zIndex: 1200,
              transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              //width: miniSidenav ? "120px" : "274px",
              overflowX: "hidden",
            }}
          >
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Minerva"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              activeContent={sidenavContent}
              activeButton={activeButton}
            />
          </MDBox>
        )}
        <MDBox
          sx={{
            position: "relative",
            height: "100vh",
            overflow: "auto",
            transition:
              "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            //marginLeft: showSidenav ? (miniSidenav ? "120px" : "274px") : "0",
            width: "100%",
          }}
        >
          <MDBox
            sx={{
              position: "fixed",
              top: "50%",
              left: miniSidenav ? "20px" : "270px",
              //transform: "translateY(-50%)",
              zIndex: 1300,
              transition: "left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <IconButton
              onClick={() => setMiniSidenav(dispatch, !miniSidenav)}
              sx={{
                backgroundColor: "white",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.16)",
                width: "26px",
                height: "26px",
                p: 0.5,
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: "18px",
                  transform: miniSidenav ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                chevron_right
              </Icon>
            </IconButton>
          </MDBox>
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/sector360" />} />
          </Routes>
        </MDBox>
      </MDBox>
      <Configurator />
    </ThemeProvider>
  );
}

function App() {
  return (
    <CacheProvider value={cache}>
      <InsightsProvider>
        <SidenavProvider>
          <AppContent />
        </SidenavProvider>
      </InsightsProvider>
    </CacheProvider>
  );
}

export default App;
