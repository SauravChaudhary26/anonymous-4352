module.exports = {
   content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
   ],
   darkMode: "class", // Enables dark mode using a 'class' approach
   theme: {
      extend: {
         colors: {
            primary: "#1d4ed8", // Custom primary color
            secondary: "#9333ea", // Custom secondary color
         },
         fontFamily: {
            sans: ["Inter", "sans-serif"],
         },
      },
   },
   plugins: [],
};
