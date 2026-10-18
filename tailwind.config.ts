import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED", // Violet vif de marque
          "purple-hover": "#6D28D9",
          "purple-light": "#EDE9FE",
          "purple-soft": "#F5F3FF",
          magenta: "#EC4899", // Rose / Magenta éclatant
          "magenta-hover": "#DB2777",
          "magenta-light": "#FCE7F3",
          pink: "#EC4899",    // Rose / Magenta éclatant (alias brand-pink)
          "pink-hover": "#DB2777",
          "pink-light": "#FCE7F3",
          gold: "#F59E0B",    // Or / Ambre chaleureux
          "gold-hover": "#D97706",
          "gold-light": "#FEF3C7",
          bg: "#FFFBF7",      // Fond crème très clair chaleureux
          charcoal: "#1E1B2E",// Anthracite profond haute lisibilité
          muted: "#5B556D",   // Texte secondaire adouci
          border: "#EADECE",
        },
      },
      fontFamily: {
        heading: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 10px 25px -5px rgba(124, 58, 237, 0.35), 0 8px 10px -6px rgba(124, 58, 237, 0.2)",
        "glow-magenta": "0 10px 25px -5px rgba(236, 72, 153, 0.35), 0 8px 10px -6px rgba(236, 72, 153, 0.2)",
        "glow-gold": "0 10px 25px -5px rgba(245, 158, 11, 0.35), 0 8px 10px -6px rgba(245, 158, 11, 0.2)",
        "warm-card": "0 12px 30px -8px rgba(124, 58, 237, 0.08), 0 4px 12px -2px rgba(236, 72, 153, 0.04)",
        "warm-card-hover": "0 20px 35px -10px rgba(124, 58, 237, 0.18), 0 8px 16px -4px rgba(236, 72, 153, 0.08)",
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
