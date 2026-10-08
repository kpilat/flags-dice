// A fair die: every roll is independent and each side has exactly the same chance, thanks to
// rejection sampling over crypto.getRandomValues.

const RANGE = 2 ** 32;
const buffer = new Uint32Array(1);

function random32(): number {
  crypto.getRandomValues(buffer);
  return buffer[0] ?? 0;
}

/** Uniformly distributed integer in [0, n). */
export function randomInt(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > RANGE) {
    throw new RangeError(`randomInt: n must be an integer from 1 to 2^32, got ${n}`);
  }
  const limit = RANGE - (RANGE % n); // largest multiple of n not above 2^32
  let x: number;
  do {
    x = random32();
  } while (x >= limit); // drop the uneven tail, then draw again
  return x % n;
}

/** Uniformly chosen item of a non-empty list. */
export function pickRandom<T>(items: readonly T[]): T {
  const item = items[randomInt(items.length)];
  if (item === undefined) throw new RangeError('pickRandom: the list is empty');
  return item;
}
