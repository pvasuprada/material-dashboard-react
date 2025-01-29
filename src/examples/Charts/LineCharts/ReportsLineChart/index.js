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

function ReportsLineChart({ color, title, description, date, chart }) {
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

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const chartData = useMemo(
    () => ({
      labels: chart?.labels || [],
      datasets: [
        {
          label: chart?.datasets?.label || "",
          tension: 0,
          pointRadius: 3,
          borderWidth: 4,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, .8)",
          fill: true,
          data: chart?.datasets?.data || [],
        },
      ],
    }),
    [chart]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
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
            color: "rgba(255, 255, 255, .2)",
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#f8f9fa",
            padding: 10,
            font: {
              size: 14,
              weight: 300,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    }),
    []
  ); // Empty dependency array since options don't change

  return (
    <>
      <Card sx={{ height: "100%" }} ref={chartRef}>
        <MDBox padding="1rem">
          <MDBox
            variant="gradient"
            bgColor={color}
            borderRadius="lg"
            coloredShadow={color}
            py={2}
            pr={0.5}
            mt={-5}
            height="12.5rem"
          >
            <Line data={chartData} options={options} />
          </MDBox>
          <MDBox pt={"10px"} px={1} display="flex" justifyContent="space-between">
            <MDTypography variant="h6" textTransform="capitalize">
              {title}
            </MDTypography>
            <MDBox>
              <IconButton onClick={handleDownload} size="small">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleFullscreen} size="small">
                <FullscreenIcon />
              </IconButton>
            </MDBox>
            {/* <MDTypography component="div" variant="button" color="text" fontWeight="light">
              {description}
            </MDTypography> */}
            {/* <Divider />
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography
                  variant="button"
                  color="text"
                  lineHeight={1}
                  sx={{ mt: 0.15, mr: 0.5 }}
                >
                  <Icon>schedule</Icon>
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="light">
                  {date}
                </MDTypography>
              </MDBox>
            </MDBox> */}
          </MDBox>
          {/* <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <IconButton onClick={handleDownload} size="small">
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={handleFullscreen} size="small">
              <FullscreenIcon />
            </IconButton>
          </MDBox> */}
        </MDBox>
      </Card>

      <Dialog fullScreen open={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <MDBox display="flex" flexDirection="column" bgcolor="white" p={3} height="100%">
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <IconButton onClick={() => setIsFullscreen(false)} size="small">
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
            <Line data={chartData} options={options} />
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
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
};

export default ReportsLineChart;
