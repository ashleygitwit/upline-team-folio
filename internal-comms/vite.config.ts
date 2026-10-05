import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { applySiteGate } from './site-gate.cjs';

function siteGatePlugin(): Plugin {
  return {
    name: 'throughline-site-gate',
    configureServer(server) {
      server.middlewares.use(applySiteGate);
    },
    configurePreviewServer(server) {
      server.middlewares.use(applySiteGate);
    },
  };
}

export default defineConfig({
  plugins: [siteGatePlugin(), react()],
  server: {
    port: 5299,
    strictPort: true,
  },
  preview: {
    port: 5299,
    strictPort: true,
  },
});
