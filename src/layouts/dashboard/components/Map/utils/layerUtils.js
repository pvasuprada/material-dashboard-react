import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import * as h3 from "h3-js";
import { createHexbinStyle } from "../config/layers";

export const updateHexbinData = (hexbinLayer, data, metric = "user_count") => {
  if (!data || !Array.isArray(data)) return;

  const features = data.map(({ geobin, ...metrics }) => {
    const hexBoundary = h3.cellToBoundary(geobin);
    const coordinates = [hexBoundary.map(([lat, lng]) => fromLonLat([lng, lat]))];
    const feature = new Feature({
      geometry: new Polygon(coordinates),
    });

    // Set all metrics on the feature
    Object.entries(metrics).forEach(([key, value]) => {
      feature.set(key, value);
    });
    feature.set("geobin", geobin);

    return feature;
  });

  const source = hexbinLayer.getSource();
  source.clear();
  source.addFeatures(features);
  
  // Update the style with the current metric
  hexbinLayer.setStyle((feature) => createHexbinStyle(feature, metric));
  
  // Force redraw
  source.changed();
};

export const createLayerGroup = (layers) => {
  return Object.entries(layers).reduce((acc, [key, layer]) => {
    acc[key] = layer;
    return acc;
  }, {});
};

export const updateLayerVisibility = (layers, visibilityState) => {
  Object.entries(visibilityState).forEach(([layerId, isVisible]) => {
    if (layers[layerId]) {
      layers[layerId].setVisible(isVisible);
    }
  });
};

export const updateMetricStyle = (hexbinLayer, metric) => {
  if (hexbinLayer) {
    hexbinLayer.setStyle((feature) => createHexbinStyle(feature, metric));
    hexbinLayer.getSource().changed();
  }
}; 