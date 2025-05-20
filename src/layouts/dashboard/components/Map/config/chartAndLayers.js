import { layerConfigs } from "./layers";

// Special layer types that don't have associated charts
export const SPECIAL_LAYERS = Object.entries(layerConfigs)
  .filter(([, config]) => config.type === "vector" || config.type === "wms")
  .map(([id]) => id);

// nQES KPI name mapping
export const NQES_KPI_MAPPING = {
  nqes_overall_score: "gnb_du_sect_carr_score",
  nqes_5g_subscore: "gnb_du_sect_carr_subscore_5g",
  nqes_capacity_subscore: "gnb_du_sect_carr_subscore_capacity",
  nqes_backhaul_score: "gnb_du_sect_carr_subscore_ethernet_backhaul",
  nqes_reliability_score: "gnb_du_sect_carr_subscore_reliability",
};

// nQES chart configurations
export const NQES_CHARTS = [
  {
    id: "nqes_overall_score",
    label: "nQES Overall Score",
    description: "View the overall nQES score over time",
    category: "nQES",
  },
  {
    id: "nqes_5g_subscore",
    label: "nQES 5G Subscore",
    description: "View the 5G subscore metrics over time",
    category: "nQES",
  },
  {
    id: "nqes_capacity_subscore",
    label: "nQES Capacity Subscore",
    description: "View the capacity subscore metrics over time",
    category: "nQES",
  },
  {
    id: "nqes_backhaul_score",
    label: "nQES Backhaul Score",
    description: "View the backhaul score metrics over time",
    category: "nQES",
  },
  {
    id: "nqes_reliability_score",
    label: "nQES Reliability Score",
    description: "View the reliability score metrics over time",
    category: "nQES",
  },
];

// nQES visualization configuration
export const NQES_VISUALIZATION_CONFIG = {
  mode: "chart",
  description: "View nQES metrics over time",
  category: "nQES",
};

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
  // Add nQES chart mappings
  ...NQES_CHARTS.reduce((acc, chart) => ({ ...acc, [chart.id]: chart.label }), {}),
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

  // nQES Charts
  ...NQES_CHARTS.reduce(
    (acc, chart) => ({
      ...acc,
      [chart.id]: {
        ...NQES_VISUALIZATION_CONFIG,
        description: chart.description,
      },
    }),
    {}
  ),

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
  if (id.startsWith("nqes_")) {
    const chart = NQES_CHARTS.find((c) => c.id === id);
    return chart ? [chart.label] : [];
  }
  return CHART_TITLE_MAP[id] ? [CHART_TITLE_MAP[id]] : [];
};
