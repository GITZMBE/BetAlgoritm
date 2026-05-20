/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        bg: "#060608",
        surface: "#0d0d12",
        "surface-high": "#13131c",
        border: "#1c1c28",
        "border-bright": "#2e2e45",
        accent: "#c8f135",
        "accent-dim": "#8fb520",
        "accent-bg": "#1a2200",
        sub: "#7070a0",
        dim: "#3a3a55",
        danger: "#ff5050",
        "danger-bg": "#1a0808",
        warn: "#f97316",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulse: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease both",
        pulse: "pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
