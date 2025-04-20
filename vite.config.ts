
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
    // Optimize bundle size heavily
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        unsafe: true
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      }
    },
    // Set target size limit to 5MB
    chunkSizeWarningLimit: 5000, // 5MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom'
          ],
          router: [
            'react-router-dom'
          ],
          utils: [
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
    },
    // Enable brotli and gzip compression for smaller output files
    reportCompressedSize: true,
    // Reduce sourcemap size in production
    sourcemap: mode !== 'production' ? true : 'hidden',
  },
  // Improve build performance
  esbuild: {
    legalComments: 'none',
    target: ['es2019', 'edge89', 'firefox78', 'chrome87', 'safari13'],
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  // Optimize dep pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'date-fns',
      'uuid'
    ],
    exclude: ['fsevents']
  },
}));
