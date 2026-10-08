import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { generateSW } from 'workbox-build';

/**
 * Generates sw.js after Astro has written every file, so the final HTML is precached too.
 * Precache URLs are relative to sw.js, so they work under any `base`.
 */
export default function serviceWorker(): AstroIntegration {
  return {
    name: 'flags-dice:service-worker',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { count, size, warnings } = await generateSW({
          globDirectory: outDir,
          globPatterns: ['**/*.{html,js,css,svg,png,ico,woff2,webmanifest}'],
          swDest: join(outDir, 'sw.js'),
          // One-page app: answer every in-scope navigation with the precached page.
          navigateFallback: 'index.html',
          // Files in _astro/ already have a hash in their name.
          dontCacheBustURLsMatching: /^_astro\//,
          cleanupOutdatedCaches: true,
          // Take over at once. Safe while nothing loads lazily: open pages keep the code they
          // loaded, and the next launch runs the new version.
          skipWaiting: true,
          clientsClaim: true,
          inlineWorkboxRuntime: true,
          sourcemap: false,
        });
        for (const warning of warnings) logger.warn(warning);
        logger.info(`sw.js generated, precaching ${count} files (${(size / 1024).toFixed(1)} KiB)`);
      },
    },
  };
}
