import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ChartOrderContext = createContext(null);

export function ChartOrderProvider({ children, initialCharts }) {
  const [chartOrder, setChartOrder] = useState(() => {
    const savedOrder = localStorage.getItem("chartOrder");
    return savedOrder ? JSON.parse(savedOrder) : initialCharts.map((_, index) => index);
  });

  const updateChartOrder = (newOrder) => {
    setChartOrder(newOrder);
    localStorage.setItem("chartOrder", JSON.stringify(newOrder));
  };

  return (
    <ChartOrderContext.Provider value={{ chartOrder, updateChartOrder }}>
      {children}
    </ChartOrderContext.Provider>
  );
}

ChartOrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialCharts: PropTypes.array.isRequired,
};

export const useChartOrder = () => {
  const context = useContext(ChartOrderContext);
  if (!context) {
    throw new Error("useChartOrder must be used within a ChartOrderProvider");
  }
  return context;
}; 