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
  const { dashboardData } = useInsights();

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
            .map((stat, index) => (
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
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description={reportsBar?.description}
                  date={reportsBar?.date}
                  chart={{
                    labels: reportsBar?.labels || [],
                    datasets: [
                      {
                        label: reportsBar?.datasets?.label || "",
                        data: reportsBar?.datasets?.data || [],
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 4,
                        maxBarThickness: 6,
                      },
                    ],
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={reportsLine?.sales?.description}
                  date={reportsLine?.sales?.date}
                  chart={{
                    labels: reportsLine?.sales?.labels || [],
                    datasets: [
                      {
                        label: reportsLine?.sales?.datasets?.label || "Sales",
                        data: reportsLine?.sales?.datasets?.data || [],
                        tension: 0,
                        pointRadius: 3,
                        borderWidth: 4,
                        backgroundColor: "transparent",
                        borderColor: "rgba(255, 255, 255, .8)",
                        maxBarThickness: 6,
                      },
                    ],
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description={reportsLine?.tasks?.description}
                  date={reportsLine?.tasks?.date}
                  chart={{
                    labels: reportsLine?.tasks?.labels || [],
                    datasets: [
                      {
                        label: reportsLine?.tasks?.datasets?.label || "Tasks",
                        data: reportsLine?.tasks?.datasets?.data || [],
                        tension: 0,
                        pointRadius: 3,
                        borderWidth: 4,
                        backgroundColor: "transparent",
                        borderColor: "rgba(255, 255, 255, .8)",
                        maxBarThickness: 6,
                      },
                    ],
                  }}
                />
              </MDBox>
            </Grid>
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
