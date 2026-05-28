import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), devtoolsJson()],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to the Express server
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
