import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Full-bleed icons get the tile colour as background; 0.2 padding keeps the flag
// inside the maskable safe zone (a circle of 80% diameter).
const fullBleed = { padding: 0.2, resizeOptions: { background: '#e9a200' } };

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, ...fullBleed },
    apple: { ...minimal2023Preset.apple, ...fullBleed },
  },
  // After changing the image, re-run `bun run generate-pwa-assets` and commit the icons it
  // writes next to it.
  images: ['public/favicon.svg'],
});
