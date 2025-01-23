import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { dashboardData as initialData } from "layouts/dashboard/data/dashboardData";

const InsightsContext = createContext();

export function InsightsProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(initialData);

  const updateInsightVisibility = (title, isVisible) => {
    setDashboardData((prev) => ({
      ...prev,
      statistics: prev.statistics.map((stat) =>
        stat.title === title ? { ...stat, visible: isVisible } : stat
      ),
    }));
  };

  return (
    <InsightsContext.Provider value={{ dashboardData, updateInsightVisibility }}>
      {children}
    </InsightsContext.Provider>
  );
}

InsightsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useInsights = () => useContext(InsightsContext);
