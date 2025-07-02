import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "static/assets",
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: "src/react/main.tsx",
      output: {
        entryFileNames: "project-explorer.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "project-explorer.css";
          }
          return "[name][extname]";
        }
      }
    }
  }
});
