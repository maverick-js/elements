/// <reference types="vitest" />
import { createReactTransform } from '@maverick-js/compiler';
import { maverick } from '@maverick-js/compiler/vite';
import { defineConfig } from 'vite';

const SERVER = !!process.env.SERVER;

export default defineConfig({
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    __SERVER__: SERVER ? 'true' : 'false',
  },
  resolve: {
    alias: {
      '@maverick-js/react': '/src/index.ts',
    },
  },
  plugins: [
    maverick({
      transform: createReactTransform(),
    }),
  ],
  // https://vitest.dev/config
  test: !SERVER
    ? {
        include: [`tests/client/**/*.test.{ts,tsx}`],
        globals: true,
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          name: 'chromium',
          screenshotFailures: false,
        },
      }
    : {
        include: [`tests/server/**/*.test.{ts,tsx}`],
        globals: true,
        environment: 'edge-runtime',
      },
});
