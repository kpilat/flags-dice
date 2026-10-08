type CubeSide = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';

interface CategoryDefinition {
  readonly id: string;
  readonly side: CubeSide;
  /** Cube rotation around X (degrees) that brings this face to the front. */
  readonly rx: number;
  /** Cube rotation around Y (degrees) that brings this face to the front. */
  readonly ry: number;
}

/** The six dice faces; they match the fields on the flag cards. */
export const CATEGORIES = [
  { id: 'country', side: 'front', rx: 0, ry: 0 },
  { id: 'capital', side: 'right', rx: 0, ry: -90 },
  { id: 'continent', side: 'back', rx: 0, ry: 180 },
  { id: 'neighbors', side: 'left', rx: 0, ry: 90 },
  { id: 'language', side: 'top', rx: -90, ry: 0 },
  { id: 'currency', side: 'bottom', rx: 90, ry: 0 },
] as const satisfies readonly CategoryDefinition[];

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category['id'];
