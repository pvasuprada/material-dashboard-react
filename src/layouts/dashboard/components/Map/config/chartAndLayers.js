import { SPECIAL_LAYERS, layerConfigs } from "./layers";

// Chart title mappings for UG metrics
export const CHART_TITLE_MAP = {
  user_count: "User Count",
  avg_dl_latency: "Avg DL Latency",
  total_dl_volume: "Total DL Volume",
  total_ul_volume: "Total UL Volume",
  avg_nr_dl_colume_share: "Avg NR DL Volume Share",
  avg_nr_ul_volume_share: "Avg NR UL Volume Share",
  dl_connections_count: "DL Connections Count",
  ul_connections_count: "UL Connections Count",
  p10_dl_speed: "P10 DL Speed",
  p10_ul_speed: "P10 UL Speed",
  p50_dl_speed: "P50 DL Speed",
  p50_ul_speed: "P50 UL Speed",
};

// VPI Analysis specific configuration
export const VPI_CONFIG = {
  mode: "chart",
  charts: ["Computation Utilization by Band"],
  description: "Add VPI Analysis chart to dashboard",
  category: "charts",
};

// Configuration for different types of visualizations
export const VISUALIZATION_CONFIGS = {
  // VPI Analysis
  vpi_analysis: VPI_CONFIG,

  // Get configurations from layerConfigs
  ...Object.entries(layerConfigs).reduce((acc, [id, config]) => {
    acc[id] = {
      mode: config.mode || (config.category === "ug" ? "chartandmap" : "map"),
      category: config.category,
      description: config.description || `Add ${config.label}`,
      ...(config.category === "ug" && { chart: config.label }),
    };
    return acc;
  }, {}),
};

// Helper function to get visualization config
export const getVisualizationConfig = (id) => {
  return (
    VISUALIZATION_CONFIGS[id] || {
      mode: "map",
      category: "unknown",
      description: `Add ${id} layer`,
    }
  );
};

// Helper function to get chart titles for a visualization
export const getChartTitles = (id) => {
  if (id === "vpi_analysis") {
    return VPI_CONFIG.charts;
  }
  return CHART_TITLE_MAP[id] ? [CHART_TITLE_MAP[id]] : [];
};

export { SPECIAL_LAYERS };
