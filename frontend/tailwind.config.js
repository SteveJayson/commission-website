/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F172A", // Deep slate/obsidian (richer than harsh navy)
          muted: "#475569",
          subtle: "#94A3B8",
        },
        paper: {
          DEFAULT: "#FAFAFC", // Clean, bright modern canvas
          pure: "#FFFFFF",
          subtle: "#F1F5F9",
        },
        cobalt: {
          DEFAULT: "#4F46E5", // Modern electric indigo-cobalt (Stripe/Linear caliber)
          deep: "#1E1B4B",    // Midnight rich indigo
          hover: "#4338CA",
          soft: "#EEF2FF",    // Crisp light indigo tint
          glow: "rgba(79, 70, 229, 0.2)",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 10px 25px -5px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 20px 35px -10px rgba(79, 70, 229, 0.12), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        glow: "0 0 35px -5px rgba(79, 70, 229, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
