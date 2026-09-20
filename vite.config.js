import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const hmrHost = process.env.X_IDE_SPACE_KEY
  ? `5173-${process.env.X_IDE_SPACE_KEY}.e2b.${process.env.X_IDE_SPACE_REGION}.${process.env.X_IDE_SPACE_HOST}`
  : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '::',
    port: 5173,
    allowedHosts: true,
    cors: true,
    hmr: hmrHost ? { protocol: 'wss', host: hmrHost } : true,
  },
});
