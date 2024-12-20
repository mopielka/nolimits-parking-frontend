import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: mode === 'production' ? 'dist-prod' : 'dist', // Custom output for production
  },
  base: mode === 'production' ? '/parking' : '',
}))
