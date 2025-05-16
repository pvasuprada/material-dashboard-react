import {
  createWMSLayer,
  createCoverageCapacityLayer,
  createRawCoverageLayer,
  createSitesLayer,
  createInterpolationLayer,
  createPopulationLayer,
  createBuildingLayer,
  createMetricLayer,
  getColorForValue,
} from "./MapFunctionalities";

// Single source of truth for all layer configurations
const layerConfigs = {
  // Base Layers
  population_wms: {
    type: "wms",
    label: "Population WMS Layer",
    category: "base",
    mode: "map",
    description: "Add Population WMS layer to map",
    config: {
      url: import.meta.env.VITE_APP_USE_WMS_PROXY
        ? import.meta.env.VITE_APP_WMS_PROXY_URL
        : import.meta.env.VITE_APP_WMS_URL,
      layers: "PopulationWms",
      visible: false,
      params: {
        FORMAT: "image/png",
        TRANSPARENT: true,
      },
    },
  },
  sites_layer: {
    type: "vector",
    label: "Sites Layer",
    category: "base",
    mode: "map",
    description: "Add Sites layer to map",
    style: {
      image: {
        type: "icon",
        src: "/sector360/towericon.png",
        scale: 0.03,
      },
    },
  },
  raw_coverage: {
    type: "vector",
    label: "Raw Coverage",
    category: "base",
    mode: "map",
    description: "Add Raw Coverage layer to map",
    style: {
      fill: { color: "rgba(255, 165, 0, 0.4)" },
      stroke: { color: "rgba(255, 165, 0, 1)", width: 2 },
    },
  },

  // UG Layers
  user_count: {
    type: "metric",
    label: "User Count",
    category: "ug",
    mode: "chartandmap",
    description: "Add User Count layer and chart",
    color: [255, 0, 0],
    unit: "",
    visualization: {
      type: "classbreak",
      breaks: [
        { min: 0, max: 10, label: "0-10 Users", color: [255, 0, 0] },
        { min: 11, max: 20, label: "11-20 Users", color: [255, 165, 0] },
        { min: 21, max: 30, label: "21-30 Users", color: [255, 255, 0] },
        { min: 31, max: Infinity, label: "31+ Users", color: [0, 255, 0] },
      ],
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.2),
  },
  avg_dl_latency: {
    type: "metric",
    label: "Avg Download Latency",
    category: "ug",
    color: [0, 0, 255],
    unit: "ms",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 10),
  },
  total_dl_volume: {
    type: "metric",
    label: "Total Download Volume",
    category: "ug",
    color: [255, 192, 203],
    unit: "GB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 5),
  },
  avg_nr_dl_colume_share: {
    type: "metric",
    label: "Avg NR DL Volume Share",
    category: "ug",
    color: [0, 255, 0],
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value),
  },
  avg_nr_rsrp: {
    type: "metric",
    label: "Avg NR RSRP",
    category: "ug",
    color: [255, 165, 0],
    unit: "dBm",
    visualization: {
      type: "classbreak",
      breaks: [
        { min: -140, max: -120, label: "Poor Signal (-140 to -120 dBm)", color: [255, 0, 0] },
        { min: -120, max: -100, label: "Fair Signal (-120 to -100 dBm)", color: [255, 165, 0] },
        { min: -100, max: -80, label: "Good Signal (-100 to -80 dBm)", color: [255, 255, 0] },
        { min: -80, max: -70, label: "Excellent Signal (-80 to -70 dBm)", color: [0, 255, 0] },
      ],
    },
    normalizer: (value) => Math.min(0.8, 0.2 + (value + 140) / 70),
  },
  avg_nr_ul_volume_share: {
    type: "metric",
    label: "Avg NR UL Volume Share",
    category: "ug",
    color: [128, 0, 128],
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value),
  },
  dl_connections_count: {
    type: "metric",
    label: "DL Connections Count",
    category: "ug",
    color: [0, 128, 128],
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  p10_dl_speed: {
    type: "metric",
    label: "P10 DL Speed",
    category: "ug",
    color: [255, 69, 0],
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 50),
  },
  p10_ul_speed: {
    type: "metric",
    label: "P10 UL Speed",
    category: "ug",
    color: [70, 130, 180],
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 30),
  },
  p50_dl_speed: {
    type: "metric",
    label: "P50 DL Speed",
    category: "ug",
    color: [219, 112, 147],
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 100),
  },
  p50_ul_speed: {
    type: "metric",
    label: "P50 UL Speed",
    category: "ug",
    color: [72, 61, 139],
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 50),
  },
  total_ul_volume: {
    type: "metric",
    label: "Total UL Volume",
    category: "ug",
    color: [154, 205, 50],
    unit: "GB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 3),
  },
  ul_connections_count: {
    type: "metric",
    label: "UL Connections Count",
    category: "ug",
    color: [139, 69, 19],
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  rec_cnt: {
    type: "metric",
    label: "Record Count",
    category: "truecall",
    mode: "map",
    description: "Add Record Count layer",
    color: [75, 192, 192],
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: false,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  erab_drop_pct: {
    type: "metric",
    label: "ERAB Drop Percentage",
    category: "truecall",
    color: [153, 102, 255],
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  volte_erab_drop_pct: {
    type: "metric",
    label: "VoLTE ERAB Drop Percentage",
    category: "truecall",
    color: [255, 159, 64],
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  rsrq_db_avg: {
    type: "metric",
    label: "RSRQ (dB)",
    category: "truecall",
    color: [128, 0, 128],
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: true,
    },
  },
  in_num_of_drops: {
    type: "metric",
    label: "Number of Drops",
    category: "truecall",
    color: [139, 0, 0],
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [0, 255, 0],
      midColor: [255, 255, 0],
      maxColor: [255, 0, 0],
      inverse: true,
    },
  },
  dl_dv_mbytes: {
    type: "metric",
    label: "DL Data Volume in MB",
    category: "truecall",
    color: [128, 0, 128],
    unit: "MB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
    },
  },
};

// Create default layers using individual creation functions
const defaultLayers = {
  population_wms: createWMSLayer({
    url: import.meta.env.VITE_APP_USE_WMS_PROXY
      ? import.meta.env.VITE_APP_WMS_PROXY_URL
      : import.meta.env.VITE_APP_WMS_URL,
    layers: "PopulationWms",
    title: "population_wms",
    visible: false,
    params: {
      FORMAT: "image/png",
      TRANSPARENT: true,
    },
  }),
  sites_layer: createSitesLayer(),
  coverage_capacity: createCoverageCapacityLayer(),
  raw_coverage: createRawCoverageLayer(),
  interpolation: createInterpolationLayer(),
  population: createPopulationLayer(),
  building: createBuildingLayer(),
  ...Object.entries(layerConfigs)
    .filter(([, config]) => config.type === "metric")
    .reduce((acc, [id, config]) => {
      acc[id] = createMetricLayer(id, config);
      return acc;
    }, {}),
};

// Create layer groups from config
const layerGroups = [
  {
    title: "Base Layers",
    titleProps: {
      sx: { color: "text.primary", fontWeight: 600, mb: 1 },
    },
    layers: Object.entries(layerConfigs)
      .filter(([, config]) => config.category === "base")
      .map(([id, config]) => ({ id, label: config.label })),
  },
  {
    title: "UG Layers",
    titleProps: {
      sx: { color: "text.primary", fontWeight: 600, mb: 1 },
    },
    layers: Object.entries(layerConfigs)
      .filter(([, config]) => config.category === "ug")
      .map(([id, config]) => ({ id, label: config.label })),
  },
  {
    title: "Truecall Layers",
    titleProps: {
      sx: { color: "text.primary", fontWeight: 600, mb: 1 },
    },
    layers: Object.entries(layerConfigs)
      .filter(([, config]) => config.category === "truecall")
      .map(([id, config]) => ({ id, label: config.label })),
  },
];

// Transform layerConfigs to metricConfigs format for backward compatibility
const metricConfigs = Object.entries(layerConfigs).reduce((acc, [id, config]) => {
  if (config.type === "metric") {
    acc[id] = {
      label: config.label,
      color: config.color,
      unit: config.unit,
      visualization: config.visualization,
      normalizer: config.normalizer,
      category: config.category,
    };
  }
  return acc;
}, {});

export { metricConfigs, defaultLayers, layerGroups, getColorForValue, layerConfigs };
