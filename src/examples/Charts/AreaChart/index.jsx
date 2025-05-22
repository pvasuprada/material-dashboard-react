// @mui icons
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// @mui material components
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

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
import html2canvas from "html2canvas";
import PropTypes from "prop-types";
import { useMemo, useState, useRef } from "react";
import { Line } from "react-chartjs-2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Context
import { useMaterialUIController } from "context";

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

function AreaChart({ color, title, description, date, chart, showLabels, fontColor }) {
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

  const getScoreColor = (value) => {
    if (value >= 9) return "rgba(0, 255, 0, 0.8)"; // Excellent - bright green
    if (value >= 7) return "rgba(144, 238, 144, 0.8)"; // Very good - light green
    if (value >= 6.5) return "rgba(255, 255, 0, 0.8)"; // Good - yellow
    if (value >= 6) return "rgba(255, 165, 0, 0.8)"; // Bad - orange
    return "rgba(255, 0, 0, 0.8)"; // Very bad - red
  };

  const chartData = useMemo(
    () => ({
      labels: chart?.labels || [],
      datasets: [
        {
          label: "Very Bad (<6)",
          data: chart?.datasets?.data?.map((value) => Math.min(6, value)) || [],
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          borderColor: "transparent",
          fill: true,
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
        },
        {
          label: "Bad (6-6.5)",
          data:
            chart?.datasets?.data?.map((value) => (value > 6 ? Math.min(6.5, value) - 6 : 0)) || [],
          backgroundColor: "rgba(255, 165, 0, 0.8)",
          borderColor: "transparent",
          fill: true,
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
        },
        {
          label: "Good (6.5-7)",
          data:
            chart?.datasets?.data?.map((value) => (value > 6.5 ? Math.min(7, value) - 6.5 : 0)) ||
            [],
          backgroundColor: "rgba(255, 255, 0, 0.8)",
          borderColor: "transparent",
          fill: true,
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
        },
        {
          label: "Very Good (7-9)",
          data:
            chart?.datasets?.data?.map((value) => (value > 7 ? Math.min(9, value) - 7 : 0)) || [],
          backgroundColor: "rgba(144, 238, 144, 0.8)",
          borderColor: "transparent",
          fill: true,
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
        },
        {
          label: "Excellent (≥9)",
          data: chart?.datasets?.data?.map((value) => (value > 9 ? value - 9 : 0)) || [],
          backgroundColor: "rgba(0, 255, 0, 0.8)",
          borderColor: "transparent",
          fill: true,
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
        },
        {
          label: "Score",
          data: chart?.datasets?.data || [],
          borderColor: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "white",
          pointBorderColor: "#666",
          pointBorderWidth: 1,
          fill: false,
          tension: 0.4,
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
          display: true,
          position: "top",
          align: "start",
          labels: {
            padding: 15,
            color: fontColor === "dark" ? "#344767" : "#ffffff",
            font: {
              size: 11,
              family: "Roboto",
            },
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
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
          callbacks: {
            label: function (context) {
              if (!context.raw) return null;
              const value = context.raw;
              if (context.datasetIndex === 5) {
                // Score dataset
                return `Score: ${value.toFixed(2)}`;
              }
              return context.dataset.label;
            },
            title: function (tooltipItems) {
              const date = new Date(tooltipItems[0].label);
              return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            },
          },
        },
      },
      scales: {
        y: {
          stacked: true,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            display: true,
            padding: 8,
            color: fontColor === "dark" ? "#344767" : "#ffffff",
            font: {
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 1,
              weight: 400,
            },
            stepSize: 2,
          },
          min: 0,
          max: 10,
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 10,
          grace: 0,
          title: {
            display: showLabels,
            text: "Score",
            color: fontColor === "dark" ? "#344767" : "#ffffff",
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
            color: fontColor === "dark" ? "#344767" : "#ffffff",
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
              if (!this.getLabelForValue(value)) return "";
              const date = new Date(this.getLabelForValue(value));
              if (isNaN(date.getTime())) return this.getLabelForValue(value);

              // Show all dates since we're dealing with a small range
              return date.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              });
            },
          },
          title: {
            display: showLabels,
            text: "Date",
            color: fontColor === "dark" ? "#344767" : "#ffffff",
            font: {
              size: 12,
              family: "Roboto",
              weight: 500,
              style: "normal",
            },
            padding: { top: 10 },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "nearest",
        axis: "x",
      },
    }),
    [darkMode, showLabels, fontColor, title]
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
              color={fontColor === "light" ? "white" : "dark"}
            >
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
            <Line data={chartData} options={chartOptions} />
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
            <MDTypography variant="h6" color={fontColor === "light" ? "white" : "dark"}>
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

// Setting default values for the props of AreaChart
AreaChart.defaultProps = {
  color: "info",
  fontColor: "dark",
  chart: {
    labels: [],
    datasets: {
      label: "",
      data: [],
    },
  },
};

// Typechecking props for the AreaChart
AreaChart.propTypes = {
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
  fontColor: PropTypes.oneOf(["dark", "light"]),
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
  }).isRequired,
  showLabels: PropTypes.bool,
};

export default AreaChart;
