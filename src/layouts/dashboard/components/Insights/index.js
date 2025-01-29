import { useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useInsights } from "context/insightsContext";

function Insights() {
  const { loading, error, filteredData } = useSelector((state) => state.filter);
  const { dashboardData, chartsData } = useInsights();

  console.log("Loading state:", loading); // Debug loading state
  console.log("filteredData:", filteredData); // Debug log

  const renderStatistics = () => {
    if (loading) {
      return dashboardData
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

    // Use statistics from filteredData
    const statistics = filteredData?.statistics || [];

    return statistics.map(({ id, title, value, unit }) => (
      <Grid item xs={12} md={6} lg={3} key={id}>
        <ComplexStatisticsCard
          color="dark"
          icon="weekend"
          title={title}
          count={`${unit}${value}`}
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
    if (loading) {
      return (
        <Grid item xs={12} md={6} key={chart.id}>
          <MDBox>
            <Skeleton
              variant="rectangular"
              height={340}
              animation="wave"
              sx={{
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
          </MDBox>
        </Grid>
      );
    }

    // Get chart data from filteredData if available, otherwise use empty data
    const chartData = filteredData?.charts?.[chart.id] || {
      labels: [],
      datasets: { label: "", data: [] },
    };

    if (chart.type === "bar") {
      return (
        <Grid item xs={12} md={6} key={chart.id}>
          <MDBox>
            <ReportsBarChart
              color={chart.color}
              title={chart.title}
              description={chart.description}
              date="updated just now"
              chart={chartData}
            />
          </MDBox>
        </Grid>
      );
    }
    return (
      <Grid item xs={12} md={6} key={chart.id}>
        <MDBox>
          <ReportsLineChart
            color={chart.color}
            title={chart.title}
            description={chart.description}
            date="updated just now"
            chart={chartData}
          />
        </MDBox>
      </Grid>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <MDBox py={3}>
        <Grid container spacing={3}>
          {renderStatistics()}

          {/* Charts Skeletons */}
          {[1, 2].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              {renderChart(chartsData[item - 1])}
            </Grid>
          ))}
        </Grid>
      </MDBox>
    );
  }

  // Show error state
  if (error) {
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        flexDirection="column"
      >
        <Icon sx={{ fontSize: 50, color: "error.main", mb: 2 }}>error_outline</Icon>
        <MDTypography variant="h4" color="error" textAlign="center">
          Error Loading Data
        </MDTypography>
        <MDTypography variant="body2" color="text" textAlign="center" mt={1}>
          {error}
        </MDTypography>
      </MDBox>
    );
  }

  // Show no data state
  if (!filteredData) {
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        flexDirection="column"
      >
        <Icon sx={{ fontSize: 50, color: "info.main", mb: 2 }}>info_outline</Icon>
        <MDTypography variant="h4" color="info" textAlign="center">
          No Data Available
        </MDTypography>
        <MDTypography variant="body2" color="text" textAlign="center" mt={1}>
          Please apply filters to view insights
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox pt={1} pb={1}>
      <Grid container spacing={2}>
        {renderStatistics()}
      </Grid>
      <MDBox mt={2}>
        <Grid container spacing={2}>
          {chartsData.filter((chart) => chart.visible).map(renderChart)}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Insights;
