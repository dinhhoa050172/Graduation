import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages phục vụ trang tại /<tên-repo>/
  base: process.env.GITHUB_ACTIONS ? '/Graduation/' : '/',
});
