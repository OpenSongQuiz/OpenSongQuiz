import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(configEnv => {
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
    build: {
      sourcemap: configEnv.mode === 'development'
    }
  }
});
