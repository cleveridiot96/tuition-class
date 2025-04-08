
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
      // SWC options - only include valid properties
      tsDecorators: false,
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
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom', 
            'date-fns',
            'uuid'
          ],
          ui: [
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            'lucide-react'
          ]
        },
        // Reduce asset sizes
        assetFileNames: 'assets/[name].[hash:8].[ext]',
        chunkFileNames: 'assets/[name].[hash:8].js',
        entryFileNames: 'assets/[name].[hash:8].js',
      }
    }
  },
  // Disable source maps in production
  sourcemap: mode !== 'production',
  // Improve build performance
  esbuild: {
    legalComments: 'none',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  }
}));
