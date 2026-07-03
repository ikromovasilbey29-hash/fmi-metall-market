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
        bg: {
          primary: "#0A0A0A",
          secondary: "#121212",
          card: "#1A1A1A",
          panel: "#1F1F1F",
        },
        accent: {
          gold: "#D4AF37",
          silver: "#C0C0C0",
          "gold-hover": "#E5C44A",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#B0B0B0",
          muted: "#6B6B6B",
        },
        border: {
          DEFAULT: "#2A2A2A",
          light: "#333333",
        },
        status: {
          new: "#3B82F6",
          processing: "#F59E0B",
          delivered: "#10B981",
          cancelled: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "Poppins", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
