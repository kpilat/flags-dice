import en from './en.json';
import sk from './sk.json';

export const LANGS = ['sk', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export const LANG_STORAGE_KEY = 'flags-dice-lang';

export const LANG_BY_BROWSER_LANG: Readonly<Record<string, Lang>> = {
  sk: 'sk',
  cs: 'sk',
  en: 'en',
};

export type MessageKey = keyof typeof en;

export const MESSAGES: Readonly<Record<Lang, Readonly<Record<MessageKey, string>>>> = { sk, en };

export function isLang(value: unknown): value is Lang {
  return LANGS.some((lang) => lang === value);
}
