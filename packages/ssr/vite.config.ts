/// <reference types="vitest" />
import { ssrTransform, type SsrTransformOptions } from '@maverick-js/compiler';
import { maverick } from '@maverick-js/compiler/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    __SERVER__: 'true',
  },
  resolve: {
    alias: {
      '@maverick-js/ssr': '/src/index.ts',
    },
  },
  plugins: [
    maverick({
      transform(data, { id }) {
        const options: SsrTransformOptions = {};

        if (id.includes('custom-element')) {
          options.customElements = true;
        }

        return ssrTransform(data, options);
      },
    }),
  ],
  // https://vitest.dev/config
  test: {
    include: [`tests/**/*.test.{ts,tsx}`],
    globals: true,
    environment: 'edge-runtime',
  },
});
