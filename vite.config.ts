/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude!,
        '**/{commitlint,postcss,tailwind}.config.*',
      ],
    },
  },
});
