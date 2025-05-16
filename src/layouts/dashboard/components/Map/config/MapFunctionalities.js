import { Vector as VectorLayer } from "ol/layer";
import ImageLayer from "ol/layer/Image";
import { Vector as VectorSource } from "ol/source";
import ImageWMS from "ol/source/ImageWMS";
import { Fill, Style, Stroke, Icon, Text } from "ol/style";

/**
 * Creates a WMS layer with authentication
 * @param {Object} config - Layer configuration
 * @returns {ImageLayer} OpenLayers WMS layer
 */
export const createWMSLayer = ({ url, layers, title, visible = true, params = {} }) => {
  const username = import.meta.env.VITE_APP_KINETICA_USERNAME;
  const password = import.meta.env.VITE_APP_KINETICA_PASSWORD;
  const authHeader = "Basic " + btoa(username + ":" + password);

  const layer = new ImageLayer({
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

/**
 * Creates a vector layer with basic configuration
 * @param {string} title - Layer title
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createVectorLayer = (title) => {
  const id = title.toLowerCase().replace(/\s+/g, "_");
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
  });
};

/**
 * Creates a coverage capacity layer
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createCoverageCapacityLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "coverage_capacity",
    visible: false,
  });
};

/**
 * Creates a raw coverage layer with styling
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createRawCoverageLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "raw_coverage",
    visible: false,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 165, 0, 0.4)",
      }),
      stroke: new Stroke({
        color: "rgba(255, 165, 0, 1)",
        width: 2,
      }),
    }),
  });
};

/**
 * Creates a sites layer with tower icon
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createSitesLayer = () => {
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

/**
 * Creates an interpolation layer with dynamic styling
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createInterpolationLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "interpolation",
    visible: false,
    style: (feature) => {
      const value = feature.get("avg_nr_rsrp");
      if (!value) return null;

      const source = feature.getSource?.() || feature.layer?.getSource();
      let minValue = -140;
      let maxValue = -70;

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

      const normalizedValue = (value - minValue) / (maxValue - minValue);
      let r, g, b;
      if (normalizedValue <= 0.5) {
        r = 255;
        g = Math.round(normalizedValue * 2 * 255);
        b = 0;
      } else {
        r = Math.round((1 - (normalizedValue - 0.5) * 2) * 255);
        g = 255;
        b = 0;
      }

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

/**
 * Creates a population layer with dynamic styling
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createPopulationLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: "population",
    visible: false,
    style: (feature) => {
      const value = feature.get("pops");
      if (!value) return null;

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

      const normalizedValue = (value - minValue) / (maxValue - minValue);
      let r, g, b;
      if (normalizedValue <= 0.5) {
        r = 255;
        g = Math.round(normalizedValue * 2 * 255);
        b = 0;
      } else {
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

/**
 * Creates a building layer with icon
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createBuildingLayer = () => {
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

/**
 * Creates a metric layer with dynamic styling based on configuration
 * @param {string} id - Layer ID
 * @param {Object} config - Metric configuration
 * @returns {VectorLayer} OpenLayers vector layer
 */
export const createMetricLayer = (id, config) => {
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
    style: (feature) => {
      const value = feature.get(id);
      if (!value) return null;

      const [r, g, b] = getColorForValue(value, config);
      return new Style({
        fill: new Fill({
          color: `rgba(${r}, ${g}, ${b}, 1)`,
        }),
        stroke: new Stroke({
          color: `rgba(${r}, ${g}, ${b}, 1)`,
          width: 1,
        }),
        text: new Text({
          text: value.toFixed(2).toString(),
          fill: new Fill({ color: "white" }),
          stroke: new Stroke({ color: "black", width: 2 }),
        }),
      });
    },
  });
};

/**
 * Gets color based on value and visualization configuration
 * @param {number} value - The value to get color for
 * @param {Object} config - Visualization configuration
 * @returns {Array} RGB color values
 */
export const getColorForValue = (value, config) => {
  if (!config.visualization) {
    return config.color;
  }

  switch (config.visualization.type) {
    case "dynamic": {
      if (value === undefined || value === null) return config.color;

      const minValue = config.visualization.minValue || 0;
      const maxValue = config.visualization.maxValue || 100;
      let normalizedValue = (value - minValue) / (maxValue - minValue);

      if (config.visualization.inverse) {
        normalizedValue = 1 - normalizedValue;
      }

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
