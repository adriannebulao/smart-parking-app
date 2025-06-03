const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    colors: {
      text: "#040316",
      background: "#fbfbfe",
      primary: "#2f27ce",
      secondary: "#dddbff",
      accent: "#443dff",
    },
  },
  plugins: [require("tailwindcss-font-inter")],
};
