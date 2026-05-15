import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./templates/**/*.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#0f172a",
          900: "#111827",
          850: "#172033",
          800: "#1e293b"
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2"
        },
        accent: {
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1"
        },
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#fb7185",
        ink: "#0f172a",
        panel: "rgba(15, 23, 42, 0.76)",
        line: "rgba(148, 163, 184, 0.20)",
        cyanGlow: "#22d3ee",
        violetGlow: "#818cf8",
        limeGlow: "#34d399"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34, 211, 238, 0.18), 0 14px 36px rgba(34, 211, 238, 0.14)",
        panel: "0 22px 70px rgba(2, 8, 23, 0.34)",
        soft: "0 14px 34px rgba(15, 23, 42, 0.12)",
        neon: "0 0 0 1px rgba(34, 211, 238, 0.18), 0 14px 36px rgba(34, 211, 238, 0.14)",
        violet: "0 18px 40px rgba(99, 102, 241, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    })
  ]
};
