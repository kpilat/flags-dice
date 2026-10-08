import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Lexend',
      cssVariable: '--font-lexend',
      weights: [500, 600, 700],
      styles: ['normal'],
      // latin-ext holds the Slovak letters (č, ď, ľ, ň, š, ť, ž, …).
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Figtree',
      cssVariable: '--font-figtree',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  ],
});
