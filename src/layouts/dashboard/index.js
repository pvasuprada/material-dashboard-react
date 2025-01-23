import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { dashboardData } from "layouts/dashboard/data/dashboardData";

import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Dashboard() {
  const { reportsLine, reportsBar, statistics } = useSelector((state) => state.dashboard);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (reportsLine && reportsBar && statistics) {
      setIsDataLoaded(true);
    }
  }, [reportsLine, reportsBar, statistics]);

  if (!isDataLoaded) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
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
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
