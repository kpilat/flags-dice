import {
  DEFAULT_LANG,
  isLang,
  LANG_STORAGE_KEY,
  type Lang,
  type MessageKey,
  MESSAGES,
} from '../i18n';
import { CATEGORIES, type Category, type CategoryId } from '../lib/categories';
import { cubeTransform, INITIAL_ROTATION, landOn, type Rotation } from '../lib/dice';
import { pickRandom, randomInt } from '../lib/random';

// Slightly longer than the cube's roll in Dice.astro (1.5s; 0.35s with reduced motion).
const ROLL_MS = 1520;
const ROLL_MS_REDUCED = 380;

function find<T extends Element>(
  selector: string,
  type: new () => T,
  root: ParentNode = document,
): T {
  const element = root.querySelector(selector);
  if (!(element instanceof type)) throw new Error(`Flags Dice: missing element ${selector}`);
  return element;
}

const stage = find('#stage', HTMLElement);
const cube = find('#cube', HTMLElement);
const throwButton = find('#throw', HTMLButtonElement);
const throwLabel = find('#throw-label', HTMLElement);
const result = find('#result', HTMLElement);
const resultIcon = find('#result-icon', SVGUseElement);
const resultEyebrow = find('#result-eyebrow', HTMLElement);
const resultName = find('#result-name', HTMLElement);
const resultQuestion = find('#result-question', HTMLElement);
const totalCount = find('#count', HTMLElement);
const resetButton = find('#reset', HTMLButtonElement);
const langGroup = find('#lang', HTMLElement);
const langButtons = [...langGroup.querySelectorAll<HTMLButtonElement>('button[data-lang]')];
const legend = CATEGORIES.map(({ id }) => {
  const item = find(`#legend [data-id="${id}"]`, HTMLLIElement);
  return { id, item, count: find('b', HTMLElement, item) };
});

let rolling = false;
let current: Category | null = null;
let total = 0;
const tally = new Map<CategoryId, number>();
let rotation: Rotation = INITIAL_ROTATION;

// Fills the per-language spans that <LocalizedText> rendered directly in `container`.
function setText(container: Element, message: MessageKey): void {
  for (const span of container.querySelectorAll<HTMLElement>(':scope > [lang]')) {
    if (isLang(span.lang)) span.textContent = MESSAGES[span.lang][message];
  }
}

function vibrate(pattern: number | number[]): void {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    // Vibration is only a nicety.
  }
}

function restartAnimation(element: HTMLElement, className: string): void {
  element.classList.remove(className);
  void element.offsetWidth; // force a reflow in between
  element.classList.add(className);
}

function render(): void {
  // Not `disabled`: disabling the focused button would drop keyboard focus mid-roll.
  throwButton.setAttribute('aria-disabled', String(rolling));
  setText(throwLabel, rolling ? 'dice.rolling' : 'dice.roll');

  for (const { id, item, count } of legend) {
    item.classList.toggle('hit', !rolling && current?.id === id);
    count.textContent = `× ${tally.get(id) ?? 0}`;
  }
  totalCount.textContent = String(total);

  if (current === null) {
    resultIcon.setAttribute('href', '#i-flag');
    setText(resultEyebrow, 'result.ready');
    setText(resultName, 'result.start');
    setText(resultQuestion, 'result.startHint');
    resultQuestion.classList.add('idle');
  } else if (!rolling) {
    resultIcon.setAttribute('href', `#i-${current.id}`);
    setText(resultEyebrow, 'result.rolled');
    setText(resultName, `category.${current.id}.name`);
    setText(resultQuestion, `category.${current.id}.question`);
    resultQuestion.classList.remove('idle');
  }
}

function roll(): void {
  if (rolling) return;
  rolling = true;
  render();

  const pick = pickRandom(CATEGORIES);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spinsX = reduceMotion ? 0 : 2 + randomInt(3);
  const spinsY = reduceMotion ? 0 : 2 + randomInt(3);
  rotation = landOn(rotation, pick, spinsX, spinsY, randomInt(19) - 9);

  vibrate(20);
  restartAnimation(stage, 'throwing');
  cube.classList.add('rolling');
  cube.style.transform = cubeTransform(rotation);

  window.setTimeout(
    () => {
      rolling = false;
      current = pick;
      tally.set(pick.id, (tally.get(pick.id) ?? 0) + 1);
      total += 1;
      stage.classList.remove('throwing');
      vibrate([12, 40, 12]);
      render();
      restartAnimation(result, 'pop');
    },
    reduceMotion ? ROLL_MS_REDUCED : ROLL_MS,
  );
}

function reset(): void {
  if (rolling) return;
  total = 0;
  current = null;
  tally.clear();
  render();
}

// Visible text switches through CSS on data-ui-lang; attributes are set here.
function applyLang(lang: Lang): void {
  document.documentElement.lang = lang;
  document.documentElement.dataset.uiLang = lang;
  stage.setAttribute('aria-label', MESSAGES[lang]['dice.roll']);
  langGroup.setAttribute('aria-label', MESSAGES[lang]['header.language']);
  for (const button of langButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  }
}

function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage can be blocked; the choice then lasts only for this visit.
  }
}

throwButton.addEventListener('click', roll);
stage.addEventListener('click', roll);
stage.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    roll();
  }
});
resetButton.addEventListener('click', reset);
for (const button of langButtons) {
  button.addEventListener('click', () => {
    const lang = button.dataset.lang;
    if (!isLang(lang)) return;
    applyLang(lang);
    saveLang(lang);
  });
}

const initialLang = document.documentElement.dataset.uiLang;
applyLang(isLang(initialLang) ? initialLang : DEFAULT_LANG);
render();
