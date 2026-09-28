import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// "base" must match the GitHub repo name so the site works on GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: '/ClaudeFocusBoard/',
})
