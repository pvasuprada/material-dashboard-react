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
import { useInsights } from "context/insightsContext";
import { chartsConfig } from "./data/chartsConfig";
import { ChartComponents } from "examples/Charts";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredData } from "../../store/slices/filterSlice";
import { getChartsConfig } from "./data/chartsConfig";
import Skeleton from "@mui/material/Skeleton";

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { dashboardData, chartsData } = useInsights();
  const dispatch = useDispatch();
  const { chartData, xData, loading } = useSelector((state) => state.charts);
  const { showSidenav, sidenavContent, activeButton, openSidenav } = useSidenav();
  const { loading: filterLoading } = useSelector((state) => state.filter);
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);

  useEffect(() => {
    if (dashboardData.statistics) {
      setIsDataLoaded(true);
    }
  }, [dashboardData.statistics]);

  useEffect(() => {
    dispatch(fetchFilteredData(selectedFilters));
  }, []);

  //const chartsConfig = getChartsConfig(chartData, xData);

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
    if (filterLoading) {
      return dashboardData.statistics
        .filter((stat) => stat.visible)
        .map((stat, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Skeleton
              variant="rectangular"
              height={160}
              animation="wave"
              sx={{
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
          </Grid>
        ));
    }

    return dashboardData.statistics
      .filter((stat) => stat.visible)
      .map(({ id, title, count, icon, color }) => (
        <Grid item xs={12} md={6} lg={3} key={id}>
          <ComplexStatisticsCard
            color={color}
            icon={icon}
            title={title}
            count={count}
            percentage={{
              color: "success",
              amount: "+1%",
              label: "than last month",
            }}
          />
        </Grid>
      ));
  };

  const renderChart = (chart) => {
    if (filterLoading) {
      return (
        <Grid item xs={12} md={4} lg={3} key={chart.id}>
          <Skeleton
            variant="rectangular"
            height={200}
            width={300}
            animation="wave"
            sx={{
              borderRadius: 2,
              backgroundColor: "#eee",
            }}
          />
        </Grid>
      );
    }
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
      <MDBox pt={1} pb={2}>
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
          {renderSummary()}
        </Grid>
        <MDBox mt={6}>
          <Grid container spacing={2}>
            {chartsData.map(renderChart)}
          </Grid>
        </MDBox>
        {/* <Insights /> */}
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
