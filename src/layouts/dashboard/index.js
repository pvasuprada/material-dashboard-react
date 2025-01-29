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
import { ChartComponents } from "examples/Charts";
import { useDispatch, useSelector } from "react-redux";
import { fetchChartData } from "store/slices/chartSlice";
import { getChartsConfig } from "./data/chartsConfig";

import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Map from "./components/Map";
import NetworkGenie from "./components/NetworkGenie";
import SiteGrid from "./components/SiteGrid";
import { useSidenav } from "context/SidenavContext";
function Dashboard({ children }) {
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;
  const [activeSection, setActiveSection] = useState("dashboards");
  const { reportsLine, reportsBar, statistics } = useSelector((state) => state.dashboard);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { dashboardData, chartsData } = useInsights();
  const dispatch = useDispatch();
  const { chartData, xData, loading } = useSelector((state) => state.charts);
  const { showSidenav, sidenavContent, activeButton, openSidenav } = useSidenav();

  useEffect(() => {
    if (reportsLine && reportsBar && statistics) {
      setIsDataLoaded(true);
    }
  }, [reportsLine, reportsBar, statistics]);

  useEffect(() => {
    dispatch(fetchChartData());
  }, [dispatch]);

  const chartsConfig = getChartsConfig(chartData, xData);

  if (!isDataLoaded) {
    return null;
  }

  // Function to update sidenav content via context or state management
  const handleSectionChange = (section) => {
    openSidenav(section);
    setActiveSection(section);
    // You can dispatch this to your context or state management if needed
    window.dispatchEvent(new CustomEvent("sidenavSectionChange", { detail: section }));
  };

  const renderStatistics = () => {
    return dashboardData
      .filter((stat) => stat.visible)
      .map((stat) => (
        <Grid item xs={12} md={6} lg={3} key={stat.id}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title={stat.title}
              count={`${stat.unit}${stat.value}`}
              percentage={{
                color: "success",
                amount: "+3%",
                label: "than last month",
              }}
            />
          </MDBox>
        </Grid>
      ));
  };

  const renderChart = (chart) => {
    if (!chart.visible || loading) return null;

    const ChartComponent = ChartComponents[chart.type];

    if (!ChartComponent) {
      console.warn(`Chart type "${chart.type}" is not supported`);
      return null;
    }

    return (
      <Grid item {...chart.gridSize} key={chart.title}>
        <MDBox mb={3}>
          <ChartComponent
            color={chart.color}
            title={chart.title}
            description={chart.data.description}
            date={chart.data.date}
            chart={{
              labels: chart.data.labels,
              datasets: chart.data.datasets,
            }}
          />
        </MDBox>
      </Grid>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={6}>
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
      <MDBox pt={1} pb={1}>
        <Grid container spacing={2}>
          {renderStatistics()}
        </Grid>
        <MDBox mt={2}>
          <Grid container spacing={2}>
            {chartsData.map(renderChart)}
          </Grid>
        </MDBox>
      </MDBox>
      <MDBox>
        <Grid container spacing={2}>
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            {/* <Projects /> */}
            <SiteGrid />
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

// Add prop-types validation
Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dashboard;
