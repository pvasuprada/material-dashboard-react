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
import { getChartsConfig } from "layouts/dashboard/data/chartsConfig";
import {
  ReportsBarChart as ReportsBarChartComponent,
  ReportsLineChart as ReportsLineChartComponent,
  BubbleChart,
  DoughnutChart,
  PieChart,
  VerticalBarChart,
  ProgressLineChart,
  GradientLineChart,
  MixedChart,
  PolarChart,
  RadarChart,
} from "examples/Charts";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredData } from "store/slices/filterSlice";
import Skeleton from "@mui/material/Skeleton";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButtonSmall from "components/MDButtonSmall";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import IconButton from "@mui/material/IconButton";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "assets/css/carousel.css";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Map from "layouts/dashboard/components/Map";
import NetworkGenie from "layouts/dashboard/components/NetworkGenie";
import SiteGrid from "layouts/dashboard/components/SiteGrid";
import { useSidenav } from "context/SidenavContext";
import zIndex from "@mui/material/styles/zIndex";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useChartOrder } from "context/chartOrderContext";

function Dashboard({ children }) {
  const [controller] = useMaterialUIController();
  const { sidenavColor, darkMode, miniSidenav } = controller;
  const [activeSection, setActiveSection] = useState("dashboards");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { dashboardData, chartsData } = useInsights();
  const dispatch = useDispatch();
  const { chartData, xData, loading } = useSelector((state) => state.charts);
  const { showSidenav, sidenavContent, activeButton, openSidenav } = useSidenav();
  const { loading: filterLoading } = useSelector((state) => state.filter);
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);
  const { chartOrder, updateChartOrder } = useChartOrder();
  const [viewMode, setViewMode] = useState("carousel"); // 'grid' or 'carousel' or 'row'
  const [activeSlide, setActiveSlide] = useState(0);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: miniSidenav ? 4 : 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  useEffect(() => {
    if (dashboardData.statistics) {
      setIsDataLoaded(true);
    }
  }, [dashboardData.statistics]);

  useEffect(() => {
    dispatch(fetchFilteredData(selectedFilters));
  }, []);

  useEffect(() => {
    let interval;
    if (viewMode === "carousel") {
      interval = setInterval(() => {
        setActiveSlide((prev) =>
          prev === chartsData.length - (miniSidenav ? 4 : 3) ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [viewMode, chartsData.length, miniSidenav]);

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

  const renderSummary = () => {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox p={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Site Info
            </MDTypography>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              cell_tower
            </Icon>
          </MDBox>
          <MDBox>
            {[
              { label: "New", count: 50, color: "success" },
              { label: "Old", count: 100, color: "warning" },
              { label: "Coming Up", count: 150, color: "info" },
              { label: "Established", count: 290, color: "primary" },
            ].map((item) => (
              <MDBox
                key={item.label}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                mb={0.5}
                sx={{
                  padding: "4px 12px",
                  borderRadius: 1,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateX(5px)",
                  },
                }}
              >
                <MDTypography
                  variant="h4"
                  fontWeight="medium"
                  sx={{
                    color: ({ palette }) => palette[item.color].main,
                    fontSize: "1.5rem",
                    width: "60px",
                    textAlign: "left",
                  }}
                >
                  {item.count}
                </MDTypography>
                <MDBox display="flex" alignItems="center" ml={2}>
                  <MDBox
                    width="8px"
                    height="8px"
                    borderRadius="50%"
                    backgroundColor={({ palette }) => palette[item.color].main}
                    mr={1.5}
                  />
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {item.label}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>
        </MDBox>
      </Card>
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(chartOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    updateChartOrder(newOrder);
  };

  const renderChartContent = (chart) => {
    if (filterLoading) {
      return (
        <Skeleton
          variant="rectangular"
          height={200}
          width="100%"
          animation="wave"
          sx={{
            borderRadius: 2,
            backgroundColor: "#eee",
          }}
        />
      );
    }
    if (!chart.visible || loading) return null;

    const ChartComponent = {
      bar: ReportsBarChartComponent,
      line: ReportsLineChartComponent,
      bubble: BubbleChart,
      doughnut: DoughnutChart,
      pie: PieChart,
      verticalBar: VerticalBarChart,
      progressLine: ProgressLineChart,
      gradientLine: GradientLineChart,
      mixed: MixedChart,
      polar: PolarChart,
      radar: RadarChart,
    }[chart.type];

    if (!ChartComponent) {
      console.warn(`Chart type "${chart.type}" is not supported`);
      return null;
    }

    return (
      <ChartComponent
        color={chart.color}
        title={chart.title}
        description={chart.data.description}
        date={chart.data.date}
        chart={{
          labels: chart.data.labels,
          datasets: chart.data.datasets,
        }}
        showLabels={chart.showLabels}
      />
    );
  };

  const renderDraggableCharts = () => {
    if (!hasVisibleCharts) return null;

    if (viewMode === "carousel") {
      return (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="custom-carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType="desktop"
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          selectedSlideIndex={activeSlide}
          afterChange={(previousSlide, { currentSlide }) => {
            setActiveSlide(currentSlide);
          }}
        >
          {visibleCharts.map((chart, index) => (
            <MDBox key={index} px={1}>
              {renderChartContent(chart)}
            </MDBox>
          ))}
        </Carousel>
      );
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="charts" direction={viewMode === "row" ? "vertical" : "horizontal"}>
          {(provided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: "flex",
                flexWrap: viewMode === "row" ? "nowrap" : "wrap",
                flexDirection: viewMode === "row" ? "column" : "row",
              }}
            >
              {chartOrder
                .map((index) => visibleCharts[index])
                .filter(Boolean)
                .map((chart, index) => (
                  <Draggable key={chart.title} draggableId={chart.title} index={index}>
                    {(provided, snapshot) => (
                      <Grid
                        item
                        xs={12}
                        md={viewMode === "row" ? 12 : (miniSidenav ? 3 : 4)}
                        lg={viewMode === "row" ? 12 : (miniSidenav ? 3 : 4)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          transition: "transform 0.2s",
                          transform: snapshot.isDragging ? "scale(1.02)" : "scale(1)",
                          zIndex: snapshot.isDragging ? 1 : "auto",
                        }}
                      >
                        <MDBox mb={3}>
                          {renderChartContent(chart)}
                        </MDBox>
                      </Grid>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Add this computed value for visible charts
  const visibleCharts = chartsData.filter((chart) => chart.visible);
  const hasVisibleCharts = visibleCharts.length > 0;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" gap={1} sx={{ zIndex: 10000 }}>
            <MDButtonSmall
              variant={activeSection === "dashboards" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("dashboards")}
            >
              Dashboards
            </MDButtonSmall>
            <MDButtonSmall
              variant={activeSection === "filters" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("filters")}
            >
              Filters
            </MDButtonSmall>
            <MDButtonSmall
              variant={activeSection === "insights" ? "contained" : "outlined"}
              color={sidenavColor}
              onClick={() => handleSectionChange("insights")}
            >
              Insights
            </MDButtonSmall>
          </MDBox>

          {hasVisibleCharts && (
            <MDBox display="flex" alignItems="center">
              <IconButton
                onClick={() => toggleViewMode("grid")}
                sx={{
                  color: darkMode ? "white" : "dark",
                  backgroundColor: viewMode === "grid" ? "rgba(0,0,0,0.05)" : "transparent",
                  mr: 1,
                  padding: "6px",
                }}
              >
                <ViewModuleIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
              <IconButton
                onClick={() => toggleViewMode("carousel")}
                sx={{
                  color: darkMode ? "white" : "dark",
                  backgroundColor: viewMode === "carousel" ? "rgba(0,0,0,0.05)" : "transparent",
                  mr: 1,
                  padding: "6px",
                }}
              >
                <ViewCarouselIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
              <IconButton
                onClick={() => toggleViewMode("row")}
                sx={{
                  color: darkMode ? "white" : "dark",
                  backgroundColor: viewMode === "row" ? "rgba(0,0,0,0.05)" : "transparent",
                  padding: "6px",
                }}
              >
                <ViewStreamIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </MDBox>
          )}
        </MDBox>
        {children}
      </MDBox>
      <MDBox pt={1} pb={1}>
        <Grid container spacing={2}>
          {renderStatistics()}
        </Grid>
        <MDBox mt={6}>
          {renderDraggableCharts()}
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
