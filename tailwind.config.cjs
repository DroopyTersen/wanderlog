/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      colors: {
        pink: "#deb9bf",
        primary: {
          100: "#e2ebf7",
          200: "#a6b6cb",
          300: "#7595b4",
          300: "#5280a3",
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
  plugins: [],
};
