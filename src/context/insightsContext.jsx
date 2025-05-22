import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useMaterialUIController } from "context";
import { getChartsConfig } from "layouts/dashboard/data/chartsConfig";
import { getDashboardConfig } from "layouts/dashboard/data/dashboardConfig";
import api from "services/api";

const InsightsContext = createContext();

export function InsightsProvider({ children }) {
  const { chartData, xData } = useSelector((state) => state.charts);
  const { statistics } = useSelector((state) => state.dashboard);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [vpiData, setVPIData] = useState(null);
  const [nqesData, setNQESData] = useState({});

  const [chartsData, setChartsData] = useState(
    getChartsConfig(chartData, xData, null, darkMode).charts
  );
  const [dashboardData, setDashboardData] = useState(getDashboardConfig(statistics));
  // const [dashboardData, setDashboardData] = useState([
  //   { id: 1, title: "Users", value: "281", unit: "", visible: false },
  //   { id: 2, title: "Revenue", value: "2,300", unit: "$", visible: false },
  //   { id: 3, title: "Modifications - Active", value: "27", unit: "", visible: false },
  //   { id: 4, title: "New Builds - Active", value: "91", unit: "", visible: false },
  // ]);

  // Update chartsData when Redux state changes
  useEffect(() => {
    console.log("Updating charts with new data:", {
      chartData,
      xData,
      vpiData,
      nqesData,
      darkMode,
    });

    // Transform nQES data if available
    let transformedChartData = [...(chartData || [])];

    // Handle all nQES data sets
    if (Object.keys(nqesData).length > 0) {
      console.log("Processing nQES data:", nqesData);

      // First collect all unique dates
      const allDates = new Set();
      Object.entries(nqesData).forEach(([chartId, dataset]) => {
        if (dataset?.data) {
          console.log(`Processing data for chart ${chartId}:`, dataset.data);
          dataset.data.forEach((item) => {
            allDates.add(new Date(item.rpt_dt).toLocaleDateString());
          });
        }
      });
      const sortedDates = Array.from(allDates).sort();
      console.log("Collected dates:", sortedDates);

      // Process each nQES dataset separately
      Object.entries(nqesData).forEach(([chartId, dataset]) => {
        if (!dataset?.data) return;

        console.log(`Processing dataset for ${chartId}`);

        // Initialize data array for this chart
        const chartValues = new Array(sortedDates.length).fill(null);

        // Fill in the values
        dataset.data.forEach((item) => {
          const date = new Date(item.rpt_dt).toLocaleDateString();
          const dateIndex = sortedDates.indexOf(date);
          if (dateIndex === -1) return;

          chartValues[dateIndex] = item.score_value;
        });

        // Create category name from the chart ID
        const categoryName = chartId
          .replace("nqes_", "NQES_")
          .split("_")
          .map((word) => {
            if (word === "5g") return "5G";
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join("_");

        console.log(`Adding data for ${categoryName}:`, {
          values: chartValues,
          dates: sortedDates,
        });

        // Add to transformed data if we have any non-null values
        if (chartValues.some((value) => value !== null)) {
          transformedChartData.push({
            categoryName: categoryName,
            data: chartValues,
            dates: sortedDates,
          });
        }
      });
    }

    const newChartsData = getChartsConfig(transformedChartData, xData, vpiData, darkMode).charts;
    console.log("Final transformed chart data:", transformedChartData);
    console.log("New charts data:", newChartsData);

    // Preserve visibility states from current charts
    setChartsData((prevCharts) => {
      const updatedCharts = newChartsData.map((newChart) => {
        const existingChart = prevCharts.find((chart) => chart.title === newChart.title);
        if (existingChart) {
          console.log(`Preserving visibility for ${newChart.title}: ${existingChart.visible}`);
          return { ...newChart, visible: existingChart.visible };
        }
        return newChart;
      });
      console.log("Final updated charts:", updatedCharts);
      return updatedCharts;
    });

    // Update dashboard data
    setDashboardData(getDashboardConfig(statistics));
  }, [chartData, xData, vpiData, nqesData, darkMode, statistics]);

  const fetchNQESData = async (params) => {
    try {
      console.log("Fetching nQES data with params:", params);
      const response = await api.getNQESScores(params);
      console.log("Received nQES response:", response);

      // Store data by chartId to maintain multiple datasets
      setNQESData((prev) => {
        const newData = {
          ...prev,
          [params.chartId]: response,
        };
        console.log("Updated nqesData state:", newData);
        return newData;
      });
    } catch (error) {
      console.error("Error fetching nQES data:", error);
    }
  };

  const updateInsightVisibility = (id) => {
    setDashboardData((prev) => ({
      ...prev,
      statistics: prev.statistics.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      ),
    }));
  };

  const updateChartVisibility = (title, isVisible) => {
    console.log("Updating chart visibility:", { title, isVisible, currentCharts: chartsData });
    setChartsData((prev) => {
      const updated = prev.map((chart) => {
        if (chart.title === title) {
          const newVisibility = isVisible === undefined ? !chart.visible : isVisible;
          console.log(
            `Found chart "${title}", updating visibility from ${chart.visible} to ${newVisibility}`
          );
          return { ...chart, visible: newVisibility };
        }
        return chart;
      });
      console.log("Updated charts:", updated);
      return updated;
    });
  };

  const value = {
    dashboardData,
    chartsData,
    updateInsightVisibility,
    updateChartVisibility,
    setVPIData,
    fetchNQESData,
    nqesData,
  };

  return <InsightsContext.Provider value={value}>{children}</InsightsContext.Provider>;
}

InsightsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useInsights = () => {
  const context = useContext(InsightsContext);
  if (context === undefined) {
    throw new Error("useInsights must be used within an InsightsProvider");
  }
  return context;
};
