import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ← allows access via IP
    port: 5173, // or any port you prefer
  },
})
