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
  const [nqesData, setNQESData] = useState(null);

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
    if (nqesData?.data) {
      const nqesScores = {
        nQES_Score: [],
        nQES_5G_Subscore: [],
        nQES_Capacity_Subscore: [],
        nQES_Backhaul_Score: [],
        nQES_Reliability_Score: [],
        dates: [],
      };

      nqesData.data.forEach((item) => {
        const date = new Date(item.rpt_dt).toLocaleDateString();
        if (!nqesScores.dates.includes(date)) {
          nqesScores.dates.push(date);
        }

        switch (item.scorename) {
          case "gnb_du_sect_carr_score":
            nqesScores.nQES_Score.push(item.score_value);
            break;
          case "gnb_du_sect_carr_subscore_5g":
            nqesScores.nQES_5G_Subscore.push(item.score_value);
            break;
          case "gnb_du_sect_carr_subscore_capacity":
            nqesScores.nQES_Capacity_Subscore.push(item.score_value);
            break;
          case "gnb_du_sect_carr_subscore_ethernet_backhaul":
            nqesScores.nQES_Backhaul_Score.push(item.score_value);
            break;
          case "gnb_du_sect_carr_subscore_reliability":
            nqesScores.nQES_Reliability_Score.push(item.score_value);
            break;
        }
      });

      // Add nQES data to transformedChartData
      Object.entries(nqesScores).forEach(([key, data]) => {
        if (key !== "dates") {
          transformedChartData.push({
            categoryName: key,
            data: data,
            dates: nqesScores.dates,
          });
        }
      });
    }

    const newChartsData = getChartsConfig(transformedChartData, xData, vpiData, darkMode).charts;
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
  }, [chartData, xData, vpiData, nqesData, darkMode, statistics]);

  const fetchNQESData = async (params) => {
    try {
      const response = await api.getNQESScores(params);
      setNQESData(response);
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
