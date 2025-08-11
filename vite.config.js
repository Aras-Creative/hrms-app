import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "service-worker",
      writeBundle() {
        const serviceWorkerPath = path.resolve(__dirname, "service-worker.js");
        const distPath = path.resolve(__dirname, "dist");
        fs.copyFileSync(serviceWorkerPath, path.join(distPath, "service-worker.js"));
      },
    },
  ],
});
