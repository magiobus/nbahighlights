module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buttonbg: "#244b88",
        buttontxt: "#ffffff",
        selectedtxt: "#291f9e",
        inputfocus: "#291f9e",
      },
    },
  },
  daisyui: {
    themes: false,
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
};
