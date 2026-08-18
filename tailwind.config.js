/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#05070d", // deeper near-black for bold contrast
        secondary: "#0d1320", // elevated surface
        "secondary-2": "#141b2d", // secondary surface variant
        accent: "#38bdf8", // sky-400 (signature accent)
        "accent-bright": "#7dd3fc", // sky-300 (hover/highlight)
        "accent-deep": "#0284c7", // sky-600 (pressed)
        glow: "#22d3ee", // cyan-400 (glow ring)
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,0.35), 0 10px 40px -10px rgba(56,189,248,0.45)",
        "glow-strong": "0 0 0 1px rgba(56,189,248,0.55), 0 20px 60px -10px rgba(56,189,248,0.6)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -20px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(56,189,248,0.08), rgba(56,189,248,0) 70%), radial-gradient(circle at 50% 0%, rgba(56,189,248,0.12), transparent 60%)",
        "radial-spot":
          "radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0) 60%)",
        "text-gradient":
          "linear-gradient(135deg, #7dd3fc 0%, #38bdf8 35%, #22d3ee 70%, #38bdf8 100%)",
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
}
