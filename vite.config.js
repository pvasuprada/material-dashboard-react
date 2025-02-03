import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      assets: path.resolve(__dirname, "./src/assets"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      examples: path.resolve(__dirname, "./src/examples"),
      context: path.resolve(__dirname, "./src/context"),
      routes: path.resolve(__dirname, "./src/routes"),
      store: path.resolve(__dirname, "./src/store"),
      services: path.resolve(__dirname, "./src/services"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    commonjsOptions: {
      include: [],
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
});
