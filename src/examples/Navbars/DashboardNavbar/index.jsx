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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import NavbarSearch from "components/NavbarSearch";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Split into two separate handler functions
  // const handleJpegScreenshot = async () => {
  //   const scrollHeight = Math.max(
  //     document.documentElement.scrollHeight,
  //     document.body.scrollHeight
  //   );

  //   const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

  //   const canvas = await html2canvas(document.body, {
  //     scrollY: -window.scrollY,
  //     height: scrollHeight,
  //     width: scrollWidth,
  //     useCORS: true,
  //     allowTaint: false,
  //   });

  //   const link = document.createElement("a");
  //   link.download = "Dashboard_Screenshot.jpg";
  //   link.href = canvas.toDataURL("image/jpeg", 0.8);
  //   link.click();
  // };

  const handleJpegScreenshot = async () => {
    const response = await fetch("http://localhost:2024/screenshot?url=" + window.location.href);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "fullpage-screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfScreenshot = async () => {
    try {
      // Get the full dimensions of the document
      const fullHeight = document.documentElement.scrollHeight;
      const fullWidth = document.documentElement.scrollWidth;

      // Save current scroll position
      const currentScrollY = window.scrollY;

      // Scroll to the top to capture the entire page
      window.scrollTo(0, 0);

      // Use html2canvas to capture the entire page
      const canvas = await html2canvas(document.documentElement, {
        useCORS: true, // Allows cross-origin images
        allowTaint: false, // Prevents tainted canvas issues
        logging: true, // Logs rendering steps
        scale: 2, // Increase the resolution
        width: fullWidth, // Ensure full width is captured
        height: fullHeight, // Ensure full height is captured
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has the correct styles
          clonedDoc.documentElement.style.overflow = "visible";
          clonedDoc.body.style.overflow = "visible";
          clonedDoc.documentElement.style.height = `${fullHeight}px`;
          clonedDoc.body.style.height = `${fullHeight}px`;
        },
      });

      // Restore the original scroll position
      window.scrollTo(0, currentScrollY);

      // Convert the canvas to an image
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Initialize jsPDF
      const pdf = new jsPDF({
        orientation: fullWidth > fullHeight ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

      // Save the PDF
      pdf.save("Full_Page_Screenshot.pdf");
    } catch (error) {
      console.error("Error capturing the page:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => ({
        ...navbar(theme, { transparentNavbar, absolute, light, darkMode }),
        height: "40px", // Reduced AppBar height
        minHeight: "40px",
      })}
    >
      <Toolbar
        sx={(theme) => ({
          ...navbarContainer(theme),
          minHeight: "40px !important", // Match AppBar height
          height: "40px",
          py: 0,
          px: 2,
        })}
      >
        <MDBox
          color="inherit"
          sx={(theme) => ({
            ...navbarRow(theme, { isMini }),
            py: 0,
          })}
        >
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          {/* <IconButton
            size="small"
            color="inherit"
            sx={{
              ...navbarMobileMenu,
              padding: "4px",
            }}
            onClick={handleMiniSidenav}
          >
            <Icon sx={iconsStyle} fontSize="small">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton> */}
        </MDBox>
        {isMini ? null : (
          <MDBox
            sx={(theme) => ({
              ...navbarRow(theme, { isMini }),
              py: 0,
            })}
          >
            <MDBox pr={1}>
              <NavbarSearch />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton
                  sx={{
                    ...navbarIconButton,
                    padding: "4px",
                  }}
                  size="small"
                >
                  <Icon sx={iconsStyle} fontSize="small">
                    account_circle
                  </Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  padding: "4px",
                }}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle} fontSize="small">
                  settings
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  padding: "4px",
                }}
                onClick={handleJpegScreenshot}
                title="Download as JPEG"
              >
                <Icon sx={iconsStyle} fontSize="small">
                  photo_camera
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  padding: "4px",
                }}
                onClick={handlePdfScreenshot}
                title="Download as PDF"
              >
                <Icon sx={iconsStyle} fontSize="small">
                  picture_as_pdf
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  ...navbarIconButton,
                  padding: "4px",
                }}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle} fontSize="small">
                  notifications
                </Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
