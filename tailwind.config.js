/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // "The instrument" palette (design-plan section 2). One cool grey family,
      // one signal colour, one material. `slate` is a single value on purpose:
      // it replaces Tailwind's default slate scale, so `text-slate-400` and
      // friends no longer exist. Use opacity modifiers (`border-slate/25`).
      colors: {
        aluminium: "#CBD0D3", // page chassis, in-page keycaps, footer
        panel: "#E8EBED", // raised device faces, receipt paper, form fields
        slate: "#3A3F45", // secondary text, silkscreen, dark keycaps, bezels
        ink: "#131518", // primary text, LCD dots, focus ring
        signal: "#F26419", // "=" keys, Send message, lit LEDs. Never text.
        lcd: "#B3BFAC", // LCD glass, only inside a bezel
      },
      // Each face stands for one manufacturing process (design-plan section 3).
      // Family names are the ones declared by the Fontsource packages imported
      // in src/main.jsx.
      fontFamily: {
        sans: [
          '"Archivo Variable"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        receipt: [
          '"Martian Mono Variable"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        lcd: ['"Doto Variable"', "ui-monospace", "monospace"],
      },
      // The only z-index values on the page (design-plan section 5).
      zIndex: {
        printer: "10",
        bar: "40",
        skip: "50",
      },
      boxShadow: {
        // Device bodies resting on the chassis: slate-tinted, light from the
        // top left, plus the top-edge highlight.
        // Keycap skirts are drawn by .keycap in src/index.css.
        device:
          "0 18px 40px -18px rgb(58 63 69 / 0.45), 0 2px 0 rgb(58 63 69 / 0.18), inset 0 1px 0 rgb(232 235 237 / 0.9)",
      },
    },
  },
  plugins: [],
}
