import { Vector as VectorLayer } from "ol/layer";
import ImageLayer from "ol/layer/Image";
import { Vector as VectorSource } from "ol/source";
import ImageWMS from "ol/source/ImageWMS";
import { Fill, Style, Stroke, Icon, Text } from "ol/style";

const metricConfigs = {
  user_count: {
    label: "User Count",
    color: [255, 0, 0], // Red
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
    label: "Avg Download Latency",
    color: [0, 0, 255], // Blue
    unit: "ms",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for high latency
      midColor: [255, 255, 0], // Yellow for medium latency
      maxColor: [0, 255, 0], // Green for low latency
      inverse: true, // Higher values are worse
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 10),
  },
  total_dl_volume: {
    label: "Total Download Volume",
    color: [255, 192, 203], // Pink
    unit: "GB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 5),
  },
  avg_nr_dl_colume_share: {
    label: "Avg NR DL Volume Share",
    color: [0, 255, 0], // Green
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value),
  },
  avg_nr_rsrp: {
    label: "Avg NR RSRP",
    color: [255, 165, 0], // Orange
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
    label: "Avg NR UL Volume Share",
    color: [128, 0, 128], // Purple
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value),
  },
  dl_connections_count: {
    label: "DL Connections Count",
    color: [0, 128, 128], // Teal
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  p10_dl_speed: {
    label: "P10 DL Speed",
    color: [255, 69, 0], // Red-Orange
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 50),
  },
  p10_ul_speed: {
    label: "P10 UL Speed",
    color: [70, 130, 180], // Steel Blue
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 30),
  },
  p50_dl_speed: {
    label: "P50 DL Speed",
    color: [219, 112, 147], // Pale Violet Red
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 100),
  },
  p50_ul_speed: {
    label: "P50 UL Speed",
    color: [72, 61, 139], // Dark Slate Blue
    unit: "Mbps",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 50),
  },
  total_ul_volume: {
    label: "Total UL Volume",
    color: [154, 205, 50], // Yellow Green
    unit: "GB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value / 3),
  },
  ul_connections_count: {
    label: "UL Connections Count",
    color: [139, 69, 19], // Saddle Brown
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
  },
  rec_cnt: {
    label: "Record Count",
    color: [75, 192, 192], // Teal
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0],
      midColor: [255, 255, 0],
      maxColor: [0, 255, 0],
      inverse: false,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
    category: "truecall",
  },
  erab_drop_pct: {
    label: "ERAB Drop Percentage",
    color: [153, 102, 255], // Purple
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
    category: "truecall",
  },
  volte_erab_drop_pct: {
    label: "VoLTE ERAB Drop Percentage",
    color: [255, 159, 64], // Orange
    unit: "%",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.1),
    category: "truecall",
  },
  vendor: {
    label: "Vendor",
    color: [128, 0, 128], // Purple
    unit: "",
    visualization: {
      type: "category",
      categories: [
        { value: "Samsung", label: "Samsung", color: [0, 255, 0] },
        { value: "Nokia", label: "Nokia", color: [255, 0, 0] },
      ],
    },
    category: "truecall",
  },
  vendors: {
    label: "Vendors",
    color: [128, 0, 128], // Purple
    unit: "",
    visualization: {
      type: "category",
      categories: [
        { value: "Samsung", label: "Samsung", color: [0, 255, 0] },
        { value: "Nokia", label: "Nokia", color: [255, 0, 0] },
        { value: "Nokia,Samsung", label: "Nokia,Samsung", color: [255, 165, 0] },
        { value: "Samsung,Nokia", label: "Samsung,Nokia", color: [255, 165, 0] },
      ],
    },
    category: "truecall",
  },
  rsrq_db_avg: {
    label: "RSRQ (dB)",
    color: [128, 0, 128], // Purple
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
      inverse: true,
    },
    category: "truecall",
  },
  in_avg_rsrq_db: {
    label: "Average RSRQ (dB)",
    color: [75, 0, 130], // Indigo
    unit: "dB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for poor RSRQ
      midColor: [255, 255, 0], // Yellow for medium RSRQ
      maxColor: [0, 255, 0], // Green for good RSRQ
      inverse: true,
    },
    category: "truecall",
  },
  in_num_of_rrc_connection_attempts: {
    label: "RRC Connection Attempts",
    color: [0, 128, 128], // Teal
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low attempts
      midColor: [255, 255, 0], // Yellow for medium attempts
      maxColor: [0, 255, 0], // Green for high attempts
    },
    category: "truecall",
  },
  in_num_of_drops: {
    label: "Number of Drops",
    color: [139, 0, 0], // Dark Red
    unit: "",
    visualization: {
      type: "dynamic",
      minColor: [0, 255, 0], // Green for low drops
      midColor: [255, 255, 0], // Yellow for medium drops
      maxColor: [255, 0, 0], // Red for high drops
      inverse: true,
    },
    category: "truecall",
  },
  in_sum_rlc_pdu_dl_volume_md: {
    label: "RLC PDU DL Volume",
    color: [0, 0, 139], // Dark Blue
    unit: "MB",
    visualization: {
      type: "dynamic",
      minColor: [255, 0, 0], // Red for low volume
      midColor: [255, 255, 0], // Yellow for medium volume
      maxColor: [0, 255, 0], // Green for high volume
    },
    category: "truecall",
  },

  // connection_status: {
  //   label: "Connection Status",
  //   color: [128, 0, 128], // Purple
  //   unit: "",
  //   visualization: {
  //     type: "category",
  //     categories: [
  //       { value: "connected", label: "Connected", color: [0, 255, 0] },
  //       { value: "disconnected", label: "Disconnected", color: [255, 0, 0] },
  //       { value: "idle", label: "Idle", color: [255, 165, 0] },
  //       { value: "unknown", label: "Unknown", color: [128, 128, 128] },
  //     ],
  //   },
  // },
};

// Helper function to get color based on visualization type and value
const getColorForValue = (value, config) => {
  if (!config.visualization) {
    // Fallback to default color if no visualization config
    return config.color;
  }

  switch (config.visualization.type) {
    case "dynamic": {
      if (value === undefined || value === null) return config.color;

      // Get min/max from source if available, otherwise use defaults
      const minValue = config.visualization.minValue || 0;
      const maxValue = config.visualization.maxValue || 100;

      // Normalize value between 0 and 1
      let normalizedValue = (value - minValue) / (maxValue - minValue);

      // Invert if specified
      if (config.visualization.inverse) {
        normalizedValue = 1 - normalizedValue;
      }

      // Interpolate between min and max colors
      const minColor = config.visualization.minColor;
      const midColor = config.visualization.midColor;
      const maxColor = config.visualization.maxColor;

      if (normalizedValue <= 0.5) {
        const t = normalizedValue * 2;
        return [
          Math.round(minColor[0] + (midColor[0] - minColor[0]) * t),
          Math.round(minColor[1] + (midColor[1] - minColor[1]) * t),
          Math.round(minColor[2] + (midColor[2] - minColor[2]) * t),
        ];
      } else {
        const t = (normalizedValue - 0.5) * 2;
        return [
          Math.round(midColor[0] + (maxColor[0] - midColor[0]) * t),
          Math.round(midColor[1] + (maxColor[1] - midColor[1]) * t),
          Math.round(midColor[2] + (maxColor[2] - midColor[2]) * t),
        ];
      }
    }

    case "classbreak": {
      if (value === undefined || value === null) return config.color;

      const break_ = config.visualization.breaks.find((b) => value >= b.min && value <= b.max);
      return break_ ? break_.color : config.color;
    }

    case "category": {
      if (value === undefined || value === null) return config.color;

      const category = config.visualization.categories.find((c) => c.value === value);
      return category ? category.color : config.color;
    }

    default:
      return config.color;
  }
};

const createHexbinLayer = (title = "Hexbins", metric = "user_count") => {
  return new VectorLayer({
    source: new VectorSource(),
    title: title,
    visible: true,
    style: (feature) => createHexbinStyle(feature, metric),
  });
};

const createWMSLayer = ({ url, layers, title, visible = true, params = {} }) => {
  const username = import.meta.env.VITE_APP_KINETICA_USERNAME;
  const password = import.meta.env.VITE_APP_KINETICA_PASSWORD;
  const authHeader = "Basic " + btoa(username + ":" + password);
  let layer = new ImageLayer({
    source: new ImageWMS({
      url: url,
      params: { LAYERS: layers, ...params },
    }),
    title: title,
    visible: visible,
  });
  layer.getSource().setImageLoadFunction((image, src) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", src, true);
    xhr.setRequestHeader("Authorization", authHeader);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const imageUrl = URL.createObjectURL(blob);
        image.src = imageUrl;
      }
    };
    xhr.send();
  });
  return layer;
};

const createVectorLayer = (title) => {
  const id = title.toLowerCase().replace(/\s+/g, "_");
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
  });
};

const createCoverageCapacityLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "coverage_capacity",
    visible: false,
  });
};

const createRawCoverageLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "raw_coverage",
    visible: false,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 165, 0, 0.4)", // Orange with 0.4 opacity
      }),
      stroke: new Stroke({
        color: "rgba(255, 165, 0, 1)", // Solid orange for border
        width: 2,
      }),
    }),
  });
};

const createSitesLayer = () => {
  return new VectorLayer({
    title: "sites_layer",
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        src: "/sector360/towericon.png",
        scale: 0.03,
        anchor: [0.5, 0.5],
      }),
    }),
  });
};

const createInterpolationLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "interpolation",
    visible: false,
    style: (feature) => {
      const value = feature.get("avg_nr_rsrp");
      if (!value) return null;

      // Get source and calculate min/max values
      const source = feature.getSource?.() || feature.layer?.getSource();
      let minValue = -140; // Default min RSRP
      let maxValue = -70; // Default max RSRP

      if (source) {
        const features = source.getFeatures();
        if (features.length > 0) {
          const values = features.map((f) => f.get("avg_nr_rsrp")).filter((v) => v != null);
          if (values.length > 0) {
            minValue = Math.min(...values);
            maxValue = Math.max(...values);
          }
        }
      }

      // Calculate normalized value between 0 and 1
      const normalizedValue = (value - minValue) / (maxValue - minValue);

      // Create color gradient from red (bad) through yellow (medium) to green (good)
      let r, g, b;
      if (normalizedValue <= 0.5) {
        // Red to Yellow transition
        r = 255;
        g = Math.round(normalizedValue * 2 * 255);
        b = 0;
      } else {
        // Yellow to Green transition
        r = Math.round((1 - (normalizedValue - 0.5) * 2) * 255);
        g = 255;
        b = 0;
      }

      // Calculate opacity based on normalized value
      const opacity = Math.min(0.8, 0.2 + normalizedValue * 0.6);

      return new Style({
        fill: new Fill({
          color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
        }),
        stroke: new Stroke({
          color: `rgba(${r}, ${g}, ${b}, 1)`,
          width: 1,
        }),
      });
    },
  });
};

const createPopulationLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "population",
    visible: false,
    style: (feature) => {
      const value = feature.get("pops");
      if (!value) return null;

      // Get source and calculate min/max values
      const source = feature.getSource?.() || feature.layer?.getSource();
      let minValue = 0;
      let maxValue = 100;

      if (source) {
        const features = source.getFeatures();
        if (features.length > 0) {
          const values = features.map((f) => f.get("pops")).filter((v) => v != null);
          if (values.length > 0) {
            minValue = Math.min(...values);
            maxValue = Math.max(...values);
          }
        }
      }

      // Calculate normalized value between 0 and 1
      const normalizedValue = (value - minValue) / (maxValue - minValue);

      // Create color gradient from red (low) through yellow (medium) to green (high)
      let r, g, b;
      if (normalizedValue <= 0.5) {
        // Red to Yellow transition
        r = 255;
        g = Math.round(normalizedValue * 2 * 255);
        b = 0;
      } else {
        // Yellow to Green transition
        r = Math.round((1 - (normalizedValue - 0.5) * 2) * 255);
        g = 255;
        b = 0;
      }

      return new Style({
        fill: new Fill({
          color: `rgba(${r}, ${g}, ${b}, 1)`,
        }),
        stroke: new Stroke({
          color: `rgba(${r}, ${g}, ${b}, 1)`,
          width: 1,
        }),
      });
    },
  });
};

const createBuildingLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "building",
    visible: false,
    style: new Style({
      image: new Icon({
        src: "/sector360/buildingicon.png",
        scale: 0.03,
        anchor: [0.5, 0.5],
      }),
    }),
  });
};

const createTruecallLayer = (title) => {
  const id = title.toLowerCase().replace(/\s+/g, "_");
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
    style: (feature) => {
      // Use the pre-calculated color stored in the feature
      const color = feature.get("color");
      const value = feature.get(id);

      if (color) {
        const fillColor = color;
        const strokeColor = color.replace(/,[^,]+\)/, ",1)"); // Set full opacity for stroke

        return [
          new Style({
            fill: new Fill({
              color: fillColor,
            }),
            stroke: new Stroke({
              color: strokeColor,
              width: 1,
            }),
          }),
          new Style({
            text: new Text({
              text: value ? value.toFixed(2).toString() : "",
              fill: new Fill({
                color: "white",
              }),
              stroke: new Stroke({
                color: "black",
                width: 2,
              }),
              font: "12px sans-serif",
              textAlign: "center",
              textBaseline: "middle",
            }),
          }),
        ];
      }

      // Fallback style if no color is set
      return new Style({
        fill: new Fill({
          color: "rgba(200, 200, 200, 0.6)",
        }),
        stroke: new Stroke({
          color: "rgba(100, 100, 100, 1)",
          width: 1,
        }),
      });
    },
  });
};

const defaultLayers = {
  geoserver: createWMSLayer({
    url: "https://ahocevar.com/geoserver/wms",
    layers: "topp:states",
    title: "geoserver",
    visible: false,
  }),
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
  hurricanes: createWMSLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/0",
    layers: "0",
    title: "hurricanes",
    visible: false,
  }),
  coverage_capacity: createCoverageCapacityLayer(),
  raw_coverage: createRawCoverageLayer(),
  interpolation: createInterpolationLayer(),
  population: createPopulationLayer(),
  building: createBuildingLayer(),
  user_count: createVectorLayer("User Count"),
  avg_dl_latency: createVectorLayer("Avg DL Latency"),
  total_dl_volume: createVectorLayer("Total DL Volume"),
  avg_nr_dl_colume_share: createVectorLayer("Avg NR DL Volume Share"),
  avg_nr_rsrp: createVectorLayer("Avg NR RSRP"),
  avg_nr_ul_volume_share: createVectorLayer("Avg NR UL Volume Share"),
  dl_connections_count: createVectorLayer("DL Connections Count"),
  p10_dl_speed: createVectorLayer("P10 DL Speed"),
  p10_ul_speed: createVectorLayer("P10 UL Speed"),
  p50_dl_speed: createVectorLayer("P50 DL Speed"),
  p50_ul_speed: createVectorLayer("P50 UL Speed"),
  total_ul_volume: createVectorLayer("Total UL Volume"),
  ul_connections_count: createVectorLayer("UL Connections Count"),
  sites_layer: createSitesLayer(),
  rec_cnt: createTruecallLayer("Record Count"),
  erab_drop_pct: createTruecallLayer("ERAB Drop Percentage"),
  volte_erab_drop_pct: createTruecallLayer("VoLTE ERAB Drop Percentage"),
  vendor: createTruecallLayer("Vendor"),
  vendors: createTruecallLayer("Vendors"),
  rsrq_db_avg: createTruecallLayer("RSRQ (dB) Avg"),
  in_avg_rsrq_db: createTruecallLayer("Average RSRQ (dB)"),
  in_num_of_rrc_connection_attempts: createTruecallLayer("RRC Connection Attempts"),
  in_num_of_drops: createTruecallLayer("Number of Drops"),
  in_sum_rlc_pdu_dl_volume_md: createTruecallLayer("RLC PDU DL Volume"),
};

const layerGroups = [
  {
    title: "Base Layers",
    titleProps: {
      sx: {
        color: "text.primary",
        fontWeight: 600,
        mb: 1,
      },
    },
    layers: [
      { id: "geoserver", label: "GeoServer Layer" },
      { id: "population_wms", label: "Population WMS Layer" },
      { id: "hurricanes", label: "Hurricanes" },
      { id: "hexbins", label: "Hexbins" },
      { id: "sites_layer", label: "Sites Layer" },
      { id: "raw_coverage", label: "Raw Coverage" },
    ],
  },
  {
    title: "UG Layers",
    titleProps: {
      sx: {
        color: "text.primary",
        fontWeight: 600,
        mb: 1,
      },
    },
    layers: [
      { id: "coverage_capacity", label: "Coverage Capacity" },
      { id: "user_count", label: "User Count" },
      { id: "avg_dl_latency", label: "Avg Download Latency" },
      { id: "total_dl_volume", label: "Total Download Volume" },
      { id: "avg_nr_dl_colume_share", label: "Avg NR DL Volume Share" },
      { id: "avg_nr_rsrp", label: "Avg NR RSRP" },
      { id: "avg_nr_ul_volume_share", label: "Avg NR UL Volume Share" },
      { id: "dl_connections_count", label: "DL Connections Count" },
      { id: "p10_dl_speed", label: "P10 DL Speed" },
      { id: "p10_ul_speed", label: "P10 UL Speed" },
      { id: "p50_dl_speed", label: "P50 DL Speed" },
      { id: "p50_ul_speed", label: "P50 UL Speed" },
      { id: "total_ul_volume", label: "Total UL Volume" },
      { id: "ul_connections_count", label: "UL Connections Count" },
    ],
  },
  {
    title: "Truecall Layers",
    titleProps: {
      sx: {
        color: "text.primary",
        fontWeight: 600,
        mb: 1,
      },
    },
    layers: [
      { id: "rec_cnt", label: "Record Count" },
      { id: "erab_drop_pct", label: "ERAB Drop Percentage" },
      { id: "volte_erab_drop_pct", label: "VoLTE ERAB Drop Percentage" },
      { id: "vendor", label: "Vendor" },
      { id: "vendors", label: "Vendors" },
      { id: "rsrq_db_avg", label: "RSRQ (dB) Avg" },
      { id: "in_avg_rsrq_db", label: "Average RSRQ (dB)" },
      { id: "in_num_of_rrc_connection_attempts", label: "RRC Connection Attempts" },
      { id: "in_num_of_drops", label: "Number of Drops" },
      { id: "in_sum_rlc_pdu_dl_volume_md", label: "RLC PDU DL Volume" },
    ],
  },
];

export {
  metricConfigs,
  createWMSLayer,
  createVectorLayer,
  defaultLayers,
  layerGroups,
  getColorForValue,
};
