import PropTypes from "prop-types";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMaterialUIController } from "context";
import { getChartsConfig } from "layouts/dashboard/data/chartsConfig";
import { getDashboardConfig } from "layouts/dashboard/data/dashboardConfig";
import api from "services/api";
import { transformVPIData } from "layouts/dashboard/data/transformers";

const InsightsContext = createContext();

export function InsightsProvider({ children }) {
  const { chartData, xData } = useSelector((state) => state.charts);
  const { statistics } = useSelector((state) => state.dashboard);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [vpiData, setVPIData] = useState(null);

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
    console.log("Updating charts with new data:", { chartData, xData, vpiData, darkMode });
    const newChartsData = getChartsConfig(chartData, xData, vpiData, darkMode).charts;
    console.log("New charts data:", newChartsData);

    // Preserve visibility states from current charts
    setChartsData((prevCharts) => {
      const updatedCharts = newChartsData.map((newChart) => {
        const existingChart = prevCharts.find((chart) => chart.title === newChart.title);
        if (existingChart) {
          return { ...newChart, visible: existingChart.visible };
        }
        return newChart;
      });
      return updatedCharts;
    });

    // Update dashboard data
    setDashboardData(getDashboardConfig(statistics));
  }, [chartData, xData, vpiData, darkMode, statistics]);

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
