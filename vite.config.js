import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      fastRefresh: true,
    }),
  ],
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
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-redux": path.resolve(__dirname, "./node_modules/react-redux"),
      "react-is": path.resolve(__dirname, "./node_modules/react-is"),
      "prop-types": path.resolve(__dirname, "./node_modules/prop-types"),
      stream: "stream-browserify",
      util: "util/",
      process: "process/browser",
      events: "events/",
      buffer: "buffer/",
      http: "stream-http",
      https: "https-browserify",
      url: "url/",
      assert: "assert/",
      os: "os-browserify/browser",
      path: "path-browserify",
      crypto: "crypto-browserify",
      zlib: "browserify-zlib",
      tty: "tty-browserify",
      fs: "memfs",
    },
    extensions: [".js", ".jsx", ".json"],
    mainFields: ["browser", "module", "jsnext:main", "jsnext", "main"],
  },
  define: {
    "process.env": {},
    global: "globalThis",
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
      include: [/node_modules/],
      transformMixedEsModules: true,
      requireReturnsDefault: "auto",
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react-redux",
            "react-is",
            "prop-types",
            "@mui/material",
            "@mui/icons-material",
            "chart.js",
            "react-chartjs-2",
          ],
        },
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-redux", "react-is", "prop-types"],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
