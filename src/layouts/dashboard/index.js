import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import Grid from "@mui/material/Grid";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { useInsights } from "context/insightsContext";
import { chartsConfig } from "./data/chartsConfig";

import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Map from "./components/Map";
import NetworkGenie from "./components/NetworkGenie";
import { useSelector } from "react-redux";

function Dashboard({ children }) {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;
  const [activeSection, setActiveSection] = useState("dashboards");
  const { reportsLine, reportsBar, statistics } = useSelector((state) => state.dashboard);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { dashboardData, chartsData } = useInsights();

  useEffect(() => {
    if (reportsLine && reportsBar && statistics) {
      setIsDataLoaded(true);
    }
  }, [reportsLine, reportsBar, statistics]);

  if (!isDataLoaded) {
    return null;
  }

  // Function to update sidenav content via context or state management
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // You can dispatch this to your context or state management if needed
    window.dispatchEvent(new CustomEvent("sidenavSectionChange", { detail: section }));
  };

  const renderChart = (chart) => {
    if (!chart.visible) return null;

    const commonProps = {
      color: chart.color,
      title: chart.title,
      description: chart.data.description,
      date: chart.data.date,
      chart: {
        labels: chart.data.labels,
        datasets:
          chart.type === "bar"
            ? chart.data.datasets
            : {
                label: chart.data.datasets.label,
                data: chart.data.datasets.data,
              },
      },
    };

    return (
      <Grid item {...chart.gridSize} key={chart.title}>
        <MDBox mb={3}>
          {chart.type === "bar" ? (
            <ReportsBarChart {...commonProps} />
          ) : (
            <ReportsLineChart {...commonProps} />
          )}
        </MDBox>
      </Grid>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox>
          <MDBox display="flex" gap={2}>
            <MDButton
              variant={activeSection === "dashboards" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("dashboards")}
            >
              Dashboards
            </MDButton>
            <MDButton
              variant={activeSection === "filters" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("filters")}
            >
              Filters
            </MDButton>
            <MDButton
              variant={activeSection === "insights" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("insights")}
            >
              Insights
            </MDButton>
          </MDBox>
        </MDBox>
        {children}
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          {dashboardData.statistics
            .filter((stat) => stat.visible)
            .map((stat) => (
              <Grid item xs={12} md={6} lg={3} key={stat.title}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color={stat.color}
                    icon={stat.icon}
                    title={stat.title}
                    count={stat.count}
                    percentage={stat.percentage}
                  />
                </MDBox>
              </Grid>
            ))}
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {chartsData.charts.map(renderChart)}
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Map />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {/* <OrdersOverview /> */}
              <NetworkGenie />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

// Add prop-types validation
Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dashboard;
