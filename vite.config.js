import { defineConfig } from "vite";

//https://vitejs.dev/config
export default defineConfig({
  base: '/HackKU23/',
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist'
  },
  publicDir: 'Images'
})