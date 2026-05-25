/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1209",
        cream: "#faf6ef",
        accent: "#c8440a"
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};
