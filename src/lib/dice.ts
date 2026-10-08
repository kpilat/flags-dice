/** Accumulated cube rotation in degrees. */
export interface Rotation {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export const INITIAL_ROTATION: Rotation = { x: 0, y: 0, z: 0 };

const mod = (n: number, m: number): number => ((n % m) + m) % m;

/**
 * Rotation that brings `face` to the front after extra full turns, tilted by `tilt` around Z.
 * Accumulates from `from`, so the CSS transition always spins forward.
 */
export function landOn(
  from: Rotation,
  face: { readonly rx: number; readonly ry: number },
  spinsX: number,
  spinsY: number,
  tilt: number,
): Rotation {
  return {
    x: from.x + 360 * spinsX + mod(face.rx - from.x, 360),
    y: from.y + 360 * spinsY + mod(face.ry - from.y, 360),
    z: tilt,
  };
}

/** CSS transform of the cube: a fixed three-quarter view, then the roll. */
export function cubeTransform({ x, y, z }: Rotation): string {
  return `rotateX(-14deg) rotateY(18deg) rotateZ(${z}deg) rotateX(${x}deg) rotateY(${y}deg)`;
}
