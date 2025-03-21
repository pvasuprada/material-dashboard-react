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

import { useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DownloadIcon from "@mui/icons-material/Download";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { useMaterialUIController } from "context";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function NetworkGenieChart({
  title,
  data,
  chartType,
  color = "info",
  fontColor = "dark",
  showLabels = true,
}) {
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

  const chartData = useMemo(
    () => ({
      labels:
        data?.records?.map(
          (record) => record[data.suggested_visualization?.[0]?.dimensions?.[0]?.field]
        ) || [],
      datasets: [
        {
          label: data?.suggested_visualization?.[0]?.measures?.[0]?.field || "",
          data:
            data?.records?.map((record) =>
              parseFloat(record[data.suggested_visualization?.[0]?.measures?.[0]?.field])
            ) || [],
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(75, 192, 192, 0.6)",
          borderColor: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: darkMode ? "rgba(255, 255, 255, 1)" : "rgba(75, 192, 192, 1)",
          pointBorderColor: darkMode ? "rgba(0, 0, 0, 0.2)" : "#fff",
        },
      ],
    }),
    [data, darkMode]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 11,
              family: "Roboto",
            },
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.95)",
          titleColor: fontColor === "dark" ? "#344767" : "#ffffff",
          bodyColor: fontColor === "dark" ? "#344767" : "#ffffff",
          padding: 12,
          bodyFont: {
            size: 11,
            weight: 400,
          },
          titleFont: {
            size: 11,
            weight: 600,
          },
          bodySpacing: 6,
          boxPadding: 6,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
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
            padding: 8,
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 11,
              family: "Roboto",
            },
          },
          title: {
            display: false,
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
            padding: 8,
            font: {
              size: 11,
              family: "Roboto",
            },
          },
          title: {
            display: false,
          },
        },
      },
    }),
    [data, darkMode, fontColor]
  );

  const ChartTypes = {
    bar_plot: Bar,
    time_series: Line,
    piechart: Pie,
    scatter_plot: Scatter,
  };

  const SelectedChart = ChartTypes[chartType] || Line;

  const renderChart = (containerProps = {}) => (
    <MDBox {...containerProps} ref={chartRef}>
      <SelectedChart data={chartData} options={chartOptions} />
    </MDBox>
  );

  return (
    <>
      <Card>
        <MDBox p={1}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <MDTypography variant="h6" fontWeight="medium" color={fontColor}>
              {title}
            </MDTypography>
            <MDBox display="flex" gap={0.5}>
              <IconButton
                onClick={handleDownload}
                size="small"
                sx={{
                  padding: "4px",
                  color: fontColor === "light" ? "#fff" : "#344767",
                  "&:hover": {
                    backgroundColor:
                      fontColor === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
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
                  color: fontColor === "light" ? "#fff" : "#344767",
                  "&:hover": {
                    backgroundColor:
                      fontColor === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </MDBox>
          </MDBox>
          {renderChart({ height: "300px" })}
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
        <MDBox display="flex" flexDirection="column" p={3} height="100%">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="h6" color={fontColor}>
              {title}
            </MDTypography>
            <IconButton
              onClick={() => setIsFullscreen(false)}
              size="small"
              sx={{
                color: fontColor === "light" ? "#fff" : "#344767",
                "&:hover": {
                  backgroundColor:
                    fontColor === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <FullscreenExitIcon />
            </IconButton>
          </MDBox>
          {renderChart({ flex: 1 })}
        </MDBox>
      </Dialog>
    </>
  );
}

NetworkGenieChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    records: PropTypes.arrayOf(PropTypes.object),
    suggested_visualization: PropTypes.arrayOf(
      PropTypes.shape({
        dimensions: PropTypes.arrayOf(
          PropTypes.shape({
            field: PropTypes.string,
          })
        ),
        measures: PropTypes.arrayOf(
          PropTypes.shape({
            field: PropTypes.string,
          })
        ),
      })
    ),
  }),
  chartType: PropTypes.oneOf(["bar_plot", "time_series", "piechart", "scatter_plot"]),
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
  fontColor: PropTypes.oneOf(["dark", "light"]),
  showLabels: PropTypes.bool,
};

export default NetworkGenieChart;
