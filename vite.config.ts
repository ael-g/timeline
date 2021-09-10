import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import compress from 'vite-plugin-compress'

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [reactRefresh(), compress()],
})
