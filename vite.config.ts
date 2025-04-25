import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Allows access from other devices on the network
    port: 8080, // Set the port number for the dev server
  },
  plugins: [
    react(), // React plugin for Vite
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias for easier imports
    },
  },
}));
