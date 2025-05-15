// MUI Icons
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// MUI Core
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

// Chart.js and React
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";

// Local
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

// Register ChartJS components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function ReportsScatterChart({ color, title, description, chart, showLabels = false }) {
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

  const chartData = useMemo(() => {
    const sectorColors = {
      "Sector 1": "hsl(120, 70%, 50%)", // Green
      "Sector 2": "hsl(240, 70%, 50%)", // Blue
      "Sector 3": "hsl(360, 70%, 50%)", // Red
    };

    return {
      datasets: Array.isArray(chart?.datasets)
        ? chart.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor || sectorColors[dataset.label] || "#1976d2",
            borderColor: dataset.borderColor || sectorColors[dataset.label] || "#1976d2",
            pointRadius: 6,
            pointHoverRadius: 10,
            showLine: false,
          }))
        : [],
    };
  }, [chart]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.95)",
          titleColor: darkMode ? "#fff" : "#344767",
          bodyColor: darkMode ? "#fff" : "#344767",
          padding: 12,
          bodyFont: {
            size: 11,
            weight: 400,
          },
          titleFont: {
            size: 11,
            weight: 600,
          },
          callbacks: {
            label: (context) => {
              const dataset = context.dataset;
              const point = dataset.data[context.dataIndex];
              let bandName = "";
              if (point.x === 1) bandName = "SUB1";
              if (point.x === 2) bandName = "SUB3";
              if (point.x === 3) bandName = "MB";
              return `${dataset.label}: ${bandName}, Utilization: ${point.y.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            beginAtZero: true,
            stepSize: 20,
            display: true,
            padding: 5,
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 9,
              family: "Roboto",
              style: "normal",
              lineHeight: 1,
            },
            callback: function (value) {
              return `${value}%`;
            },
          },
          title: {
            display: true,
            text: "Computation Utilization (%)",
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 9,
              family: "Roboto",
              weight: 500,
              style: "normal",
            },
            padding: { bottom: 0 },
          },
        },
        x: {
          type: "linear",
          min: 0.5,
          max: 3.5,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            borderDash: [5, 5],
            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            stepSize: 1,
            display: true,
            color: darkMode ? "#fff" : "#344767",
            padding: 5,
            font: {
              size: 9,
              family: "Roboto",
              style: "normal",
              lineHeight: 1,
            },
            callback: function (value) {
              if (value === 1) return "SUB1";
              if (value === 2) return "SUB3";
              if (value === 3) return "MB";
              return "";
            },
            autoSkip: false,
          },
          title: {
            display: false,
          },
        },
      },
      layout: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    }),
    [darkMode]
  );

  return (
    <>
      <Card sx={{ height: "100%" }} ref={chartRef}>
        <MDBox p={1}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
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
          {chartData.datasets.length > 0 ? (
            <MDBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              coloredShadow={color}
              py={1}
              pr={0.5}
              height="10rem"
              sx={{
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <Scatter data={chartData} options={chartOptions} />
            </MDBox>
          ) : (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="10rem"
              bgcolor={darkMode ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.02)"}
              borderRadius="lg"
            >
              <MDTypography variant="button" color="text">
                No data available
              </MDTypography>
            </MDBox>
          )}
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
            <Scatter data={chartData} options={chartOptions} />
          </MDBox>
        </MDBox>
      </Dialog>
    </>
  );
}

ReportsScatterChart.propTypes = {
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
  description: PropTypes.string,
  chart: PropTypes.object.isRequired,
  showLabels: PropTypes.bool,
};

export default ReportsScatterChart;
