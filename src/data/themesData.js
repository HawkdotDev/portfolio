// src/data/themesData.js

const UNIFIED_DARK_THEME = {
  canvas: "#141414",           // Charcoal dark canvas
  brand: "#501296",            // Plum purple brand accent
  loader: "#7b2cbf",           // Bright violet purple
  videoBg: "#b57eed",          // Muted lavender purple
  text: "#ffffff",             // Pure white text
  border: "#ffffff",           // White borders
  blend: "screen",
  glow: "#501296"              // Purple glow
};

export const THEMES = [
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    canvas: "#F6E2BB",
    brand: "#F01450",
    loader: "#ff8da1",
    videoBg: "#ffd3de",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    glow: "#ffb3c1",
    dark: UNIFIED_DARK_THEME
  },
  {
    id: "sage-red",
    name: "Sage & Red",
    canvas: "#7ea366",
    brand: "#dc2626",
    loader: "#f87171",
    videoBg: "#fca5a5",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    glow: "#f87171",
    dark: UNIFIED_DARK_THEME
  },
  {
    id: "matcha",
    name: "Matcha Green",
    canvas: "#faf6ee",
    brand: "#7da852",
    loader: "#93c468",
    videoBg: "#e8f2df",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    glow: "#93c468",
    dark: UNIFIED_DARK_THEME
  },
  {
    id: "Bold Red",
    name: "Bold Red",
    canvas: "#faf9f6",
    brand: "#d90429",
    loader: "#ef233c",
    videoBg: "#ffccd5",
    text: "#141414",
    border: "#000000",
    blend: "multiply",
    glow: "#ef233c",
    dark: UNIFIED_DARK_THEME
  },
  {
    id: "kraft-orange",
    name: "Kraft & Orange",
    canvas: "#e6d5bc",
    brand: "#d95d16",
    loader: "#f28546",
    videoBg: "#f7cbb2",
    text: "#241812",
    border: "#1c120c",
    blend: "multiply",
    glow: "#f28546",
    dark: UNIFIED_DARK_THEME
  },
  {
    id: "mono-chrome",
    name: "Monochrome Gray",
    canvas: "#e5e7eb",
    brand: "#111827",
    loader: "#4b5563",
    videoBg: "#9ca3af",
    text: "#1f2937",
    border: "#111827",
    blend: "multiply",
    glow: "#9ca3af",
    dark: UNIFIED_DARK_THEME
  }
];
