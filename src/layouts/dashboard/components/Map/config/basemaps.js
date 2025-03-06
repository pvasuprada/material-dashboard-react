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

export const createBasemaps = () => ({
  osm: new TileLayer({
    source: new OSM(),
    title: "OSM",
  }),
  streets: createMapboxLayer("streets-v12"),
  dark: createMapboxLayer("dark-v11"),
  light: createMapboxLayer("light-v11"),
  satellite: createMapboxLayer("satellite-v9"),
  outdoors: createMapboxLayer("outdoors-v12"),
});

export const basemapOptions = [
  { id: "osm", label: "OpenStreetMap" },
  { id: "streets", label: "Streets" },
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "satellite", label: "Satellite" },
  { id: "outdoors", label: "Outdoors" },
]; 