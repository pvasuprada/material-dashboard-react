// Third-party imports
import PropTypes from "prop-types";
import html2canvas from "html2canvas";

// MUI Core imports
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

// MUI Icons
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

// React imports
import { useMemo, useState, useRef } from "react";
import { Line } from "react-chartjs-2";

// Local imports
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

function ReportsMultiLineChart({ color, title, chart, showLabels = false }) {
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
    return {
      labels: chart?.labels || [],
      datasets: Array.isArray(chart?.datasets)
        ? chart.datasets.map((dataset) => ({
            ...dataset,
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
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
          display: true,
          position: "top",
          labels: {
            color: darkMode ? "#fff" : "#344767",
            font: {
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
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
          bodySpacing: 6,
          boxPadding: 6,
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
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
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
          title: {
            display: showLabels,
            text: "Computation Utilization",
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
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            display: true,
            color: darkMode ? "#fff" : "#344767",
            padding: 10,
            font: {
              size: 11,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
          title: {
            display: showLabels,
            text: "Band Group",
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
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
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
              py={2}
              pr={0.5}
              height="16rem"
            >
              <Line data={chartData} options={chartOptions} />
            </MDBox>
          ) : (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="16rem"
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
            <Line data={chartData} options={chartOptions} />
          </MDBox>
        </MDBox>
      </Dialog>
    </>
  );
}

ReportsMultiLineChart.propTypes = {
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
  chart: PropTypes.object.isRequired,
  showLabels: PropTypes.bool,
};

export default ReportsMultiLineChart;
