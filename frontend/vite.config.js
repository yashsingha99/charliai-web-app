import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    host: true, // ← allows external access (important for Ngrok)
    port: 5173, // or your port
    strictPort: true, // ensures Vite uses the port you want
    cors: true, // optional: helps with some cross-origin requests
  },
  
})
