import { Fill, Style, Stroke, Icon } from "ol/style";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

export const metricConfigs = {
  user_count: {
    label: "User Count",
    color: [255, 0, 0], // Red
    unit: "",
    normalizer: (value) => Math.min(0.8, 0.2 + value * 0.2),
  },
  avg_dl_latency: {
    label: "Avg Download Latency",
    color: [0, 0, 255], // Blue
    unit: "ms",
    normalizer: (value) => Math.min(0.8, 0.2 + value / 10),
  },
  total_dl_volume: {
    label: "Total Download Volume",
    color: [255, 192, 203], // Pink
    unit: "GB",
    normalizer: (value) => Math.min(0.8, 0.2 + value / 5),
  },
};

export const createHexbinStyle = (feature, metric) => {
  const config = metricConfigs[metric];
  const value = feature.get(metric);
  const opacity = value ? config.normalizer(value) : 0.2;
  const [r, g, b] = config.color;

  return new Style({
    fill: new Fill({
      color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    }),
    stroke: new Stroke({
      color: `rgba(${r}, ${g}, ${b}, 1)`,
      width: 1,
    }),
  });
};

export const createHexbinLayer = (title = "Hexbins", metric = "user_count") => {
  return new VectorLayer({
    source: new VectorSource(),
    title: title,
    visible: true,
    style: (feature) => createHexbinStyle(feature, metric),
  });
};

export const createWMSLayer = ({ url, layers, title, visible = true, params = {} }) => {
  return new ImageLayer({
    source: new ImageWMS({
      url: url,
      params: { LAYERS: layers, ...params },
    }),
    title: title,
    visible: visible,
  });
};

const createVectorLayer = (title, color) => {
  const id = title.toLowerCase().replace(/\s+/g, "_");
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
    style: (feature) => {
      // Use the exact property names from the data
      let value;
      switch (id) {
        case "user_count":
          value = feature.get("user_count");
          // Get all features to determine min/max for scaling
          const source = feature.getSource?.() || feature.layer?.getSource();
          let min = 0;
          let max = 100; // default max

          if (source) {
            const features = source.getFeatures();
            if (features.length > 0) {
              const values = features.map((f) => f.get("user_count")).filter((v) => v != null);
              if (values.length > 0) {
                min = Math.min(...values);
                max = Math.max(...values);
              }
            }
          }

          // Calculate normalized value between 0 and 1
          const normalizedValue = (value - min) / (max - min);

          // Create color gradient from red (0) through yellow (0.5) to green (1)
          let r, g, b;
          if (normalizedValue <= 0.5) {
            // Red to Yellow
            r = 255;
            g = Math.round(normalizedValue * 2 * 255);
            b = 0;
          } else {
            // Yellow to Green
            r = Math.round((1 - (normalizedValue - 0.5) * 2) * 255);
            g = 255;
            b = 0;
          }

          const opacity = Math.min(0.8, 0.2 + normalizedValue * 0.6);

          return new Style({
            fill: new Fill({
              color: `rgba(${r}, ${g}, ${b})`,
            }),
            stroke: new Stroke({
              color: `rgba(${r}, ${g}, ${b})`,
              width: 1,
            }),
          });
          break;
        case "total_download_volume":
        case "total_dl_volume":
          value = feature.get("total_dl_volume");
          // Get all features to determine min/max for scaling
          const dlSource = feature.getSource?.() || feature.layer?.getSource();
          let dlMin = 0;
          let dlMax = 5; // default max

          if (dlSource) {
            const dlFeatures = dlSource.getFeatures();
            if (dlFeatures.length > 0) {
              const dlValues = dlFeatures
                .map((f) => f.get("total_dl_volume"))
                .filter((v) => v != null);
              if (dlValues.length > 0) {
                dlMin = Math.min(...dlValues);
                dlMax = Math.max(...dlValues);
              }
            }
          }

          // Calculate normalized value between 0 and 1
          const dlNormalizedValue = (value - dlMin) / (dlMax - dlMin);

          // Create color gradient from red (0) through yellow (0.5) to green (1)
          let dlR, dlG, dlB;
          if (dlNormalizedValue <= 0.5) {
            // Red to Yellow
            dlR = 255;
            dlG = Math.round(dlNormalizedValue * 2 * 255);
            dlB = 0;
          } else {
            // Yellow to Green
            dlR = Math.round((1 - (dlNormalizedValue - 0.5) * 2) * 255);
            dlG = 255;
            dlB = 0;
          }

          const dlOpacity = Math.min(0.8, 0.2 + dlNormalizedValue * 0.6);

          return new Style({
            fill: new Fill({
              color: `rgba(${dlR}, ${dlG}, ${dlB}, ${dlOpacity})`,
            }),
            stroke: new Stroke({
              color: `rgba(${dlR}, ${dlG}, ${dlB}, ${dlOpacity})`,
              width: 1,
            }),
          });
          break;
        case "avg_download_latency":
        case "avg_dl_latency":
          value = feature.get("avg_dl_latency");
          break;
        default:
          value = feature.get(id);
      }

      let opacity = 0.2;
      if (value && !["user_count", "total_dl_volume"].includes(id)) {
        // Skip for user_count and total_dl_volume as they're handled above
        switch (id) {
          case "avg_download_latency":
          case "avg_dl_latency":
            opacity = Math.min(0.8, 0.2 + value / 100);
            break;
          default:
            opacity = 0.5;
        }

        return new Style({
          fill: new Fill({
            color: `rgba(${color.join(",")}, ${opacity})`,
          }),
          stroke: new Stroke({
            color: `rgba(${color.join(",")}, 1)`,
            width: 1,
          }),
        });
      }
    },
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

// Example layer configurations
export const defaultLayers = {
  geoserver: createWMSLayer({
    url: "https://ahocevar.com/geoserver/wms",
    layers: "topp:states",
    title: "geoserver",
    visible: false,
  }),
  hurricanes: createWMSLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/0",
    layers: "0",
    title: "hurricanes",
    visible: false,
  }),
  coverage_capacity: createCoverageCapacityLayer(),
  raw_coverage: createRawCoverageLayer(),
  user_count: createVectorLayer("User Count", [255, 0, 0]),
  avg_dl_latency: createVectorLayer("Avg DL Latency", [0, 0, 255]),
  total_dl_volume: createVectorLayer("Total DL Volume", [255, 192, 203]),
  sites_layer: createSitesLayer(),
};

// Layer groups for the layer list
export const layerGroups = [
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
      { id: "hurricanes", label: "Hurricanes" },
      { id: "hexbins", label: "Hexbins" },
    ],
  },
  {
    title: "Data Layers",
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
      { id: "avg_dl_latency", label: "Avg Download Latency (Blue)" },
      { id: "total_dl_volume", label: "Total Download Volume" },
    ],
  },
];
