/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('')",
      },
      keyframes: {
        borderFlow: {
          "0%": { opacity: "0.35", boxShadow: "none" },
          "50%": {
            opacity: "1",
            boxShadow:
              "0 0 25px rgba(145,94,255,0.35), 0 0 35px rgba(125,211,252,0.25)",
          },
          "100%": { opacity: "0.35", boxShadow: "none" },
        },
      },
      animation: {
        borderFlow: "borderFlow 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
