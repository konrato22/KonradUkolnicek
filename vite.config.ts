import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/konrato22/',
  server: {
    proxy: {
      '/auth': 'https://konradukolnicek.onrender.com',
      '/tasks': 'https://konradukolnicek.onrender.com',
    }
  }
})