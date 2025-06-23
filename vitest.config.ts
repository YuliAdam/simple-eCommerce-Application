import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteConfig from './vite.config';
import { resolve } from 'node:path';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*test.ts', 'src/**/*test.tsx', 'test/**/*test.ts', 'test/**/**/*test.ts'],
    },
  }),
);
