import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './kanban-saas-frontend',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './kanban-saas-frontend/src'),
    },
  },
})
