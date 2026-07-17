import { create } from "zustand";
import { THEMES } from "../data/themesData";

// Helper function to update CSS variables in DOM
export const applyThemeColors = (theme, isDark) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (isDark && theme.dark) {
    const d = theme.dark;
    root.style.setProperty("--color-canvas", d.canvas);
    root.style.setProperty("--color-accent-brand", d.brand);
    root.style.setProperty("--color-accent-loader", d.loader);
    root.style.setProperty("--color-accent-video-bg", d.videoBg);
    root.style.setProperty("--color-accent-glow", d.glow || d.brand);
    root.style.setProperty("--glow-shadow", `6px 6px 16px 0px ${d.glow || d.brand}`);
    root.style.setProperty("--color-text-main", d.text);
    root.style.setProperty("--color-border-main", d.border);
    root.style.setProperty("--image-blend-mode", d.blend || "screen");
    root.style.setProperty("--dot-color", "rgba(255, 255, 255, 0.03)");
    root.style.setProperty("--texture-color", "rgba(0, 0, 0, 0.25)");
  } else {
    root.style.setProperty("--color-canvas", theme.canvas);
    root.style.setProperty("--color-accent-brand", theme.brand);
    root.style.setProperty("--color-accent-loader", theme.loader);
    root.style.setProperty("--color-accent-video-bg", theme.videoBg);
    root.style.setProperty("--color-accent-glow", theme.glow || theme.brand);
    root.style.setProperty("--glow-shadow", "6px 6px 0px 0px rgba(0, 0, 0, 1)");
    root.style.setProperty("--color-text-main", theme.text);
    root.style.setProperty("--color-border-main", theme.border);
    root.style.setProperty("--image-blend-mode", theme.blend || "multiply");
    root.style.setProperty("--dot-color", "rgba(0, 0, 0, 0.03)");
    root.style.setProperty("--texture-color", "rgba(255, 255, 255, 0.15)");
  }
};

// Safe helper to get initial localStorage state
const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("portfolio-dark-mode") === "true";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return THEMES[0];
  const saved = localStorage.getItem("selected-portfolio-theme");
  const found = THEMES.find((t) => t.id === saved);
  return found || THEMES[0];
};

export const useThemeStore = create((set, get) => {
  const initialDark = getInitialDarkMode();
  const initialTheme = getInitialTheme();
  
  // Apply colors on store init (for SSR safety, check window)
  if (typeof window !== "undefined") {
    applyThemeColors(initialTheme, initialDark);
  }

  return {
    isDarkMode: initialDark,
    currentTheme: initialTheme,

    selectTheme: (theme) => {
      set({ currentTheme: theme });
      if (typeof window !== "undefined") {
        localStorage.setItem("selected-portfolio-theme", theme.id);
      }
      applyThemeColors(theme, get().isDarkMode);
    },

    toggleDarkMode: () => {
      const nextDark = !get().isDarkMode;
      set({ isDarkMode: nextDark });
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio-dark-mode", String(nextDark));
      }
      applyThemeColors(get().currentTheme, nextDark);
    }
  };
});
