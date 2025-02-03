import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getChartsConfig } from "layouts/dashboard/data/chartsConfig";
import { getDashboardConfig } from "layouts/dashboard/data/dashboardConfig";
const InsightsContext = createContext();

export function InsightsProvider({ children }) {
  const { chartData, xData } = useSelector((state) => state.charts);
  const { statistics } = useSelector((state) => state.dashboard);
  // const [dashboardData, setDashboardData] = useState([
  //   { id: 1, title: "Users", value: "281", unit: "", visible: false },
  //   { id: 2, title: "Revenue", value: "2,300", unit: "$", visible: false },
  //   { id: 3, title: "Modifications - Active", value: "27", unit: "", visible: false },
  //   { id: 4, title: "New Builds - Active", value: "91", unit: "", visible: false },
  // ]);

  const [chartsData, setChartsData] = useState(getChartsConfig(chartData, xData).charts);
  const [dashboardData, setDashboardData] = useState(getDashboardConfig(statistics));
  // Update chartsData when Redux state changes
  useEffect(() => {
    let a = getChartsConfig(chartData, xData).charts;
    console.log("getChartsConfig(chartData, xData).charts:", a);
    setChartsData(getChartsConfig(chartData, xData).charts);
    console.log("statistics:", statistics);
    console.log("getDashboardConfig(statistics):", getDashboardConfig(statistics));
    setDashboardData(getDashboardConfig(statistics));
  }, [chartData, xData, statistics]);

  const updateInsightVisibility = (id) => {
    setDashboardData((prev) => ({
      ...prev,
      statistics: prev.statistics.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      ),
    }));
  };

  const updateChartVisibility = (title) => {
    setChartsData((prev) =>
      prev.map((chart) => (chart.title === title ? { ...chart, visible: !chart.visible } : chart))
    );
  };

  return (
    <InsightsContext.Provider
      value={{
        dashboardData,
        updateInsightVisibility,
        chartsData,
        updateChartVisibility,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
}

InsightsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useInsights() {
  return useContext(InsightsContext);
}
