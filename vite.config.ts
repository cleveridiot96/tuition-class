
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './', // This ensures all assets are loaded using relative paths
  build: {
    outDir: 'dist', // Changed from 'pendrive-app' to standard 'dist'
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevents code splitting for a single bundle
      }
    }
  }
}));
