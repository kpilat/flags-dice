import type { APIRoute } from 'astro';
import { DEFAULT_LANG } from '../i18n';
import { SITE } from '../lib/site';

const base = import.meta.env.BASE_URL;

interface ManifestIcon {
  readonly src: string;
  readonly sizes: string;
  readonly type: string;
  readonly purpose?: 'any' | 'maskable' | 'monochrome';
}

// Generated from public/favicon.svg by `bun run generate-pwa-assets` (pwa-assets.config.ts).
const icons: readonly ManifestIcon[] = [
  { src: `${base}pwa-64x64.png`, sizes: '64x64', type: 'image/png' },
  { src: `${base}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
  { src: `${base}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
  {
    src: `${base}maskable-icon-512x512.png`,
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
];

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      // The id resolves against the origin, so it needs the base path to stay unique on github.io.
      id: base,
      name: SITE.name,
      description: SITE.description,
      lang: DEFAULT_LANG,
      dir: 'ltr',
      start_url: base,
      scope: base,
      display: 'standalone',
      background_color: SITE.themeColor.light,
      theme_color: SITE.themeColor.light,
      categories: ['games', 'education'],
      icons,
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
