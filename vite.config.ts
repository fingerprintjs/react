import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import licensePlugin from 'vite-plugin-banner'
import { dependencies, version } from './package.json'
import banner2 from 'rollup-plugin-banner2'

const licenseContents = `Fingerprint React SDK v${version} - Copyright (c) FingerprintJS, Inc, ${new Date().getFullYear().toString()} (https://fingerprint.com)
Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.`

export default defineConfig({
  build: {
    // Bundle source maps for easier debugging
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      fileName: 'fingerprint-react',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      // @ts-expect-error rollup-plugin-banner2 ships stale Rollup Plugin types (unmaintained)
      plugins: [banner2(() => `'use client';\n`)],
      external: ['react', 'react-dom', 'react/jsx-runtime', ...Object.keys(dependencies)],
    },
  },
  plugins: [
    // @ts-expect-error vite-plugin-banner ships stale Rollup Plugin types (unmaintained)
    licensePlugin({
      content: licenseContents,
    }),
    dts({
      rollupTypes: true,
    }),
  ],
})
