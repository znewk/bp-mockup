import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Относительный base — сборка одинаково работает и локально, и на GitHub Pages
  // в подпапке вида https://<user>.github.io/<repo>/. Роутинг — HashRouter.
  base: './',
  server: {
    port: 4300,
    host: true, // чтобы макет открывался с телефона по IP в той же сети
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
