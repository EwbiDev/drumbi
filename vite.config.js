import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://ewbidev.github.io/drumbi/",
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utilities": path.resolve(__dirname, "src/utilities"),
    },
  },
});
