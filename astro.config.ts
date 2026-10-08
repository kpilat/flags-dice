import { defineConfig, fontProviders } from 'astro/config';
import serviceWorker from './integrations/service-worker';

export default defineConfig({
  // Preview gets its own port: the service worker it installs would otherwise take over the
  // dev server on the same origin and keep serving the old build.
  server: ({ command }) => ({ port: command === 'preview' ? 4322 : 4321 }),
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
  integrations: [serviceWorker()],
});
