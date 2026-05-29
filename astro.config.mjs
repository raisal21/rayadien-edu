// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  prefetch: {
    defaultStrategy: 'viewport'
  },
  fonts: [
    {
      name: 'Big Shoulders',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: [400, 700, 800],
      styles: ['normal']
    },
    {
      name: 'Public Sans',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700, 800],
      styles: ['normal', 'italic']
    },
    {
      name: 'Space Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.google(),
      weights: [400, 700],
      styles: ['normal', 'italic']
    }
  ]
});
