import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 3000,
    proxy: {
      // this is the same proxy configuration, as in package.json for webpack
      // route specific
      "/api": "http://localhost:5000",
    },
  },
  resolve: {
    alias: {
      crypto: "empty-module",
    },
  },
  define: {
    global: "globalThis",
  },
});
