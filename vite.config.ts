import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    proxy: {
      "/api/v2/oauth": {
        target: "https://ngw.devices.sberbank.ru:9443",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v2\/oauth/, "/api/v2/oauth"),
      },
      "/gigachat-api": {
        target: "https://gigachat.devices.sberbank.ru",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gigachat-api/, "/api/v1"),
      },
    },
  },
});
