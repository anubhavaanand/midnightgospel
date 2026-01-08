import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite'; // Trigger rebuild
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@shaders': path.resolve(__dirname, './src/shaders'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 3000, // Suppress warnings for large vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', '@react-three/rapier'],
          utils: ['zustand', 'gsap', 'framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', 'zustand', 'gsap'],
  },
});
