import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*test.ts', 'src/**/*test.tsx', 'test/**/*test.ts', 'test/**/**/*test.ts'],
    },
  }),
);
