import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["fonts/**/*", "images/**/*", "favicon.png"],
      manifest: {
        name: "Wanderlog",
        short_name: "Wanderlog",
        theme_color: "#324d60",
        background_color: "#324d60",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "images/manifest-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "images/manifest-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
      },
    }),
  ],
});
