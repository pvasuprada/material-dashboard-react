import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { dashboardData as initialData } from "layouts/dashboard/data/dashboardData";
import { chartsConfig as initialCharts } from "layouts/dashboard/data/chartsConfig";

const InsightsContext = createContext();

export function InsightsProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [chartsData, setChartsData] = useState(initialCharts);

  const updateInsightVisibility = (title, isVisible) => {
    setDashboardData((prev) => ({
      ...prev,
      statistics: prev.statistics.map((stat) =>
        stat.title === title ? { ...stat, visible: isVisible } : stat
      ),
    }));
  };

  const updateChartVisibility = (title, isVisible) => {
    setChartsData((prev) => ({
      ...prev,
      charts: prev.charts.map((chart) =>
        chart.title === title ? { ...chart, visible: isVisible } : chart
      ),
    }));
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

export const useInsights = () => useContext(InsightsContext);
