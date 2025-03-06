import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ChartOrderContext = createContext(null);

export function ChartOrderProvider({ children, initialCharts }) {
  const [chartOrder, setChartOrder] = useState(() => {
    const savedOrder = localStorage.getItem("chartOrder");
    // If we have a saved order and it's a valid array with the right length
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Validate the saved order
        if (Array.isArray(parsed) && parsed.every(index => index >= 0 && index < initialCharts.length)) {
          return parsed;
        }
      } catch (e) {
        console.warn("Invalid chart order in localStorage");
      }
    }
    // If no valid saved order, create default order
    return initialCharts.map((_, index) => index);
  });

  // Update stored order whenever charts change
  useEffect(() => {
    const savedOrder = localStorage.getItem("chartOrder");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // If the saved order length doesn't match current charts, reset it
        if (!Array.isArray(parsed) || parsed.length !== initialCharts.length) {
          const newOrder = initialCharts.map((_, index) => index);
          setChartOrder(newOrder);
          localStorage.setItem("chartOrder", JSON.stringify(newOrder));
        }
      } catch (e) {
        console.warn("Invalid chart order in localStorage");
      }
    }
  }, [initialCharts]);

  const updateChartOrder = (newOrder) => {
    // Validate the new order before updating
    if (Array.isArray(newOrder) && 
        newOrder.length === initialCharts.length && 
        newOrder.every(index => index >= 0 && index < initialCharts.length)) {
      setChartOrder(newOrder);
      localStorage.setItem("chartOrder", JSON.stringify(newOrder));
    } else {
      console.warn("Invalid chart order provided");
    }
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