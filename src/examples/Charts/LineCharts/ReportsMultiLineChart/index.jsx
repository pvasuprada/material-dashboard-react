import { useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

function ReportsMultiLineChart({ color, title, description, date, chart }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);

  console.log("MultiLineChart props:", { color, title, description, date, chart });

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
    console.log("Processing chart data:", chart);
    return {
      labels: chart?.labels || [],
      datasets: Array.isArray(chart?.datasets)
        ? chart.datasets.map((dataset) => ({
            ...dataset,
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }))
        : [],
    };
  }, [chart]);

  console.log("Processed chart data:", chartData);

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
        title: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
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
        },
        x: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
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
        },
      },
    }),
    [darkMode]
  );

  return (
    <Card sx={{ height: "100%" }} ref={chartRef}>
      <MDBox padding="1rem">
        {chartData.datasets.length > 0 ? (
          <MDBox
            variant="gradient"
            bgColor={color}
            borderRadius="lg"
            coloredShadow={color}
            py={2}
            pr={0.5}
            mt={-5}
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
            mt={-5}
            bgcolor={darkMode ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.02)"}
            borderRadius="lg"
          >
            <MDTypography variant="button" color="text">
              No data available for VPI Analysis
            </MDTypography>
          </MDBox>
        )}
        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography>
            <MDBox ml="auto">
              <IconButton onClick={handleDownload} size="small">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
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
  description: PropTypes.string,
  date: PropTypes.string,
  chart: PropTypes.object.isRequired,
};

export default ReportsMultiLineChart;
