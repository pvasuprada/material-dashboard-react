/**
=========================================================
* Material Dashboard 2  React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import { useRef, useState } from "react";
import { useMaterialUIController } from "context";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DownloadIcon from "@mui/icons-material/Download";
import Dialog from "@mui/material/Dialog";
import html2canvas from "html2canvas";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ReportsBarChart({ color, title, description, date, chart, showLabels }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);

  const handleDownload = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${title}.png`;
      link.href = url;
      link.click();
    }
  };

  const getChartColors = (colorName) => {
    const colors = {
      primary: "#1A73E8",
      secondary: "#7b809a",
      info: "#49a3f1",
      success: "#66BB6A",
      warning: "#FFA726",
      error: "#EF5350",
      dark: "#344767",
      light: "#CED4DA",
    };
    return colors[colorName] || colors.info;
  };

  const chartData = useMemo(
    () => ({
      labels: chart?.labels || [],
      datasets:
        chart?.datasets?.map((dataset) => ({
          ...dataset,
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)",
          borderRadius: 5,
          borderWidth: 0,
          barThickness: 20,
        })) || [],
    }),
    [chart, darkMode]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
          titleColor: darkMode ? "#fff" : "#344767",
          bodyColor: darkMode ? "#fff" : "#344767",
          padding: 10,
          bodyFont: {
            size: 10,
          },
          titleFont: {
            size: 10,
          },
          bodySpacing: 5,
          boxPadding: 5,
        },
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            display: true,
            padding: 10,
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 10,
              family: "inherit",
            },
          },
          title: {
            display: showLabels,
            text: "Value",
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 12,
              family: "Roboto",
              weight: 500,
              style: "normal",
            },
            padding: { bottom: 0 },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: darkMode ? "#fff" : "#344767",
            padding: 10,
            font: {
              size: 10,
              family: "inherit",
            },
          },
          title: {
            display: showLabels,
            text: "Time Period",
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 12,
              family: "Roboto",
              weight: 500,
              style: "normal",
            },
            padding: { top: 0 },
          },
        },
      },
    }),
    [darkMode, showLabels]
  );

  return (
    <>
      <Card sx={{ height: "100%" }} ref={chartRef}>
        <MDBox p={1}>
          <MDBox
            variant="gradient"
            bgColor={color}
            borderRadius="lg"
            coloredShadow={color}
            py={1}
            pr={0.5}
            mt={-3}
            height="10rem"
            sx={{
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </MDBox>
          <MDBox pt={1} px={0.5} display="flex" alignItems="center" justifyContent="space-between">
            <MDTypography
              variant="caption"
              fontWeight="medium"
              textTransform="capitalize"
              color={darkMode ? "white" : "dark"}
            >
              {title}
            </MDTypography>
            <MDBox display="flex" gap={0.5}>
              <IconButton
                onClick={handleDownload}
                size="small"
                sx={{
                  padding: "4px",
                  color: darkMode ? "#fff" : "#344767",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setIsFullscreen(true)}
                size="small"
                sx={{
                  padding: "4px",
                  color: darkMode ? "#fff" : "#344767",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: darkMode ? "#1a2035" : "#f0f2f5",
          },
        }}
      >
        <MDBox display="flex" flexDirection="column" p={2} height="100%">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="h6" color={darkMode ? "white" : "dark"}>
              {title}
            </MDTypography>
            <IconButton
              onClick={() => setIsFullscreen(false)}
              size="small"
              sx={{
                color: darkMode ? "#fff" : "#344767",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <FullscreenExitIcon />
            </IconButton>
          </MDBox>
          <MDBox
            flex={1}
            variant="gradient"
            bgColor={color}
            borderRadius="lg"
            coloredShadow={color}
            p={2}
          >
            <Bar data={chartData} options={chartOptions} />
          </MDBox>
        </MDBox>
      </Dialog>
    </>
  );
}

ReportsBarChart.defaultProps = {
  color: "dark",
  description: "",
  showLabels: true,
  date: "",
  chart: {
    labels: [],
    datasets: [],
  },
};

ReportsBarChart.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  showLabels: PropTypes.bool,
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ReportsBarChart;
