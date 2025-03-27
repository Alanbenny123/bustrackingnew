// Map configuration constants
export const KERALA_CENTER: [number, number] = [10.177686162000652, 76.43159471152298];
export const KERALA_BOUNDS: [[number, number], [number, number]] = [
  [8.0, 74.0],
  [17.0, 84.0],
];
export const ADI_SHANKARA_POSITION: [number, number] = [
  10.177686162000652, 76.43159471152298,
];
export const API_KEY =
  "5b3ce3597851110001cf6248bc068998129b41b6bc4b41db34be1934";

export const TILE_LAYERS = {
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
};
