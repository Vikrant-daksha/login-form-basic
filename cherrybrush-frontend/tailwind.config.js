/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Grayscale Palette from provided image
        night: "#131313",  // Deepest black
        onyx: "#3C3C3C",   // Dark grey
        dim: "#646464",    // Medium grey
        silver: "#B5B5B5", // Light grey
        smoke: "#F3F3F3",  // Very light grey (White smoke)

        // Semantic mapping for a professional monochromatic UI
        primary: "#131313",
        secondary: "#3C3C3C",
        accent: "#646464",
        muted: "#B5B5B5",
        background: "#F3F3F3",
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 20s linear infinite',
      },
    },
  },
  plugins: [],
};
