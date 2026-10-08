import type { Config } from 'prettier';
import type { PluginOptions } from 'prettier-plugin-astro';

const config: Config & PluginOptions = {
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};

export default config;
