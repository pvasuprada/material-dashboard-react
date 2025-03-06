import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

const createMapboxLayer = (style, apiKey) => {
  return new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/{z}/{x}/{y}?access_token=${apiKey}`,
      tileSize: 512,
      maxZoom: 22,
    }),
    title: style,
  });
};

export const createBasemaps = (apiKey) => ({
  osm: new TileLayer({
    source: new OSM(),
    title: "OSM",
  }),
  streets: createMapboxLayer("streets-v12", apiKey),
  dark: createMapboxLayer("dark-v11", apiKey),
  light: createMapboxLayer("light-v11", apiKey),
  satellite: createMapboxLayer("satellite-v9", apiKey),
  outdoors: createMapboxLayer("outdoors-v12", apiKey),
});

export const basemapOptions = [
  { id: "osm", label: "OpenStreetMap" },
  { id: "streets", label: "Streets" },
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "satellite", label: "Satellite" },
  { id: "outdoors", label: "Outdoors" },
]; 