const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

// CONFIGURACIÓN CORRECTA
module.exports = defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
});
