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

import { useMemo, useState, useRef } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

// ReportsLineChart configurations
import configs from "examples/Charts/LineCharts/ReportsLineChart/configs";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ReportsLineChart({ color, title, showLabels, description, date, chart }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const chartData = useMemo(
    () => ({
      labels: chart?.labels || [],
      datasets: [
        {
          label: chart?.datasets?.label || "",
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2,
          backgroundColor: "rgba(255, 255, 255, .1)",
          borderColor: "rgba(255, 255, 255, .8)",
          fill: true,
          data: chart?.datasets?.data || [],
        },
      ],
    }),
    [chart]
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
            padding: 5,
            color: darkMode ? "#fff" : "#fff",
            font: {
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 1,
            },
            stepSize: Math.ceil(
              (Math.max(...(chart?.datasets?.data || [])) -
                Math.min(...(chart?.datasets?.data || []))) /
                5
            ),
            maxTicksLimit: 5,
          },
          title: {
            display: showLabels,
            text: "Value",
            color: darkMode ? "#fff" : "#fff",
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
            color: darkMode ? "#fff" : "#fff",
            padding: 5,
            font: {
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 1,
            },
            maxRotation: 0,
            minRotation: 0,
            callback: function (value, index, values) {
              if (index > 0 && (index - 1) % 3 === 0) {
                return this.getLabelForValue(value);
              }
              return "";
            },
          },
          title: {
            display: showLabels,
            text: "Time Period",
            color: darkMode ? "#fff" : "#fff",
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
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    }),
    [darkMode, chart]
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
            <Line data={chartData} options={chartOptions} />
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
                onClick={handleFullscreen}
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
            <Line data={chartData} options={chartOptions} />
          </MDBox>
        </MDBox>
      </Dialog>
    </>
  );
}

// Setting default values for the props of ReportsLineChart
ReportsLineChart.defaultProps = {
  color: "info",
  description: "",
  chart: {
    labels: [],
    datasets: {
      label: "",
      data: [],
    },
  },
};

// Typechecking props for the ReportsLineChart
ReportsLineChart.propTypes = {
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
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
  }).isRequired,
  showLabels: PropTypes.bool,
};

export default ReportsLineChart;
