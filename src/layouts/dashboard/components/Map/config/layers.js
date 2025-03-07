import { Fill, Style, Stroke } from "ol/style";
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
    normalizer: (value) => Math.min(0.8, 0.2 + (value / 10)),
  },
  total_dl_volume: {
    label: "Total Download Volume",
    color: [255, 192, 203], // Pink
    unit: "GB",
    normalizer: (value) => Math.min(0.8, 0.2 + (value / 5)),
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

export const createWMSLayer = ({
  url,
  layers,
  title,
  visible = true,
  params = {},
}) => {
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
  const id = title.toLowerCase().replace(/\s+/g, '_');
  return new VectorLayer({
    source: new VectorSource(),
    title: id,
    visible: false,
    style: (feature) => {
      // Use the exact property names from the data
      let value;
      switch(id) {
        case 'user_count':
          value = feature.get('user_count');
          break;
        case 'avg_download_latency':
        case 'avg_dl_latency':
          value = feature.get('avg_dl_latency');
          break;
        case 'total_download_volume':
        case 'total_dl_volume':
          value = feature.get('total_dl_volume');
          break;
        default:
          value = feature.get(id);
      }

      let opacity = 0.2;
      if (value) {
        switch(id) {
          case 'user_count':
            opacity = Math.min(0.8, 0.2 + value * 0.2);
            break;
          case 'avg_download_latency':
          case 'avg_dl_latency':
            opacity = Math.min(0.8, 0.2 + (value / 100));
            break;
          case 'total_download_volume':
          case 'total_dl_volume':
            opacity = Math.min(0.8, 0.2 + (value / 5));
            break;
          default:
            opacity = 0.5;
        }
      }
      
      return new Style({
        fill: new Fill({
          color: `rgba(${color.join(',')}, ${opacity})`,
        }),
        stroke: new Stroke({
          color: `rgba(${color.join(',')}, 1)`,
          width: 1,
        }),
      });
    },
  });
};

const createCoverageCapacityLayer = () => {
  return new VectorLayer({
    source: new VectorSource(),
    title: 'coverage_capacity',
    visible: false,
    style: (feature) => {
      const value = feature.get('bn77_rsrp');
      const opacity = value ? Math.min(0.8, 0.2 + (value / 100)) : 0.2;
      return new Style({
        fill: new Fill({
          color: `rgba(139, 69, 19, ${opacity})`,
        }),
        stroke: new Stroke({
          color: 'rgba(139, 69, 19, 1)',
          width: 1,
        }),
      });
    },
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
  user_count: createVectorLayer('User Count', [255, 0, 0]),
  avg_dl_latency: createVectorLayer('Avg DL Latency', [0, 0, 255]),
  total_dl_volume: createVectorLayer('Total DL Volume', [255, 192, 203]),
};

// Layer groups for the layer list
export const layerGroups = [
  {
    title: "Base Layers",
    layers: [
      { id: "geoserver", label: "GeoServer Layer" },
      { id: "hurricanes", label: "Hurricanes" },
      { id: "hexbins", label: "Hexbins" },
    ],
  },
  {
    title: "Data Layers",
    layers: [
      { id: "coverage_capacity", label: "Coverage Capacity (Brown)" },
      { id: "user_count", label: "User Count (Red)" },
      { id: "avg_dl_latency", label: "Avg Download Latency (Blue)" },
      { id: "total_dl_volume", label: "Total Download Volume (Pink)" },
    ],
  },
]; 