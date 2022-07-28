/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--textFont)", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      colors: {
        pink: "#deb9bf",
        primary: {
          100: "#e2ebf7",
          200: "#a6b6cb",
          300: "#7595b4",
          400: "#5280a3",
          500: "#497799",
          600: "#3c6a8d",
          700: "#324d60",
        },
        gold: {
          200: "#fff4e4",
          300: "#fce5c6",
          400: "#fcd8a7",
          500: "#ffc87d",
          600: "#e0a554",
          700: "#c98c38",
          800: "#b97c27",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        wanderlog: {
          primary: "#ffc87d",
          secondary: "#deb9bf",
          accent: "#d1d5db",
          neutral: "#497799",
          "base-100": "#324E61",
          info: "#bae6fd",
          success: "#99f6e4",
          warning: "#fef08a",
          error: "#f87171",
          "--rounded-btn": "25px",
        },
      },
    ],
  },
};
