
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Use minimal React features
      jsxImportSource: undefined,
      // Use faster SWC transforms
      swcOptions: {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
              development: mode === 'development',
              refresh: mode === 'development',
            },
          },
        },
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Reduce asset sizes
        assetFileNames: 'assets/[name].[hash:8].[ext]',
        chunkFileNames: 'assets/[name].[hash:8].js',
        entryFileNames: 'assets/[name].[hash:8].js',
      }
    }
  },
  // Disable source maps in production
  sourcemap: mode !== 'production',
}));
