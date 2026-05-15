import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/static/react/",
  plugins: [react()],
  build: {
    outDir: "static/react",
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        entryFileNames: "app.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith(".css")
            ? "app.css"
            : "assets/[name]-[hash][extname]"
      }
    }
  }
});
