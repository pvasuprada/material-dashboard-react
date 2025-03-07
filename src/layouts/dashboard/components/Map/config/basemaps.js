import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { MAPBOX_API_KEY } from "./keys";

const createMapboxLayer = (style) => {
  return new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: style,
  });
};

export const createBasemaps = () => {
  return {
    light: new TileLayer({
      source: new XYZ({
        url: `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`,
        tileSize: 512,
        maxZoom: 18,
      }),
      visible: true,
      preload: Infinity,
      useInterimTilesOnError: true,
    }),
    dark: new TileLayer({
      source: new XYZ({
        url: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`,
        tileSize: 512,
        maxZoom: 18,
      }),
      visible: true,
      preload: Infinity,
      useInterimTilesOnError: true,
    }),
    osm: new TileLayer({
      source: new OSM(),
      title: "OSM",
      visible: false,
    }),
    streets: createMapboxLayer("streets-v12"),
    satellite: createMapboxLayer("satellite-v9"),
    outdoors: createMapboxLayer("outdoors-v12"),
  };
};

export const basemapOptions = [
  { id: "osm", label: "OpenStreetMap" },
  { id: "streets", label: "Streets" },
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "satellite", label: "Satellite" },
  { id: "outdoors", label: "Outdoors" },
]; 