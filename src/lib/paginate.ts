// src/lib/paginate.ts
// Splits a Page into scrollless Sheets for the horizontal BookViewer

import type { Page, Block, Exercise, KeyTerm } from '@/types/content';

// Estimated viewport "units" each block type consumes (viewport height ≈ 12 units)
const BLOCK_WEIGHT: Record<Block['kind'], number> = {
  lead: 4,
  heading: 1.5,
  paragraph: 2,
  definition: 3,
  theorem: 4.5,
  equation: 1.5,
  keyPoint: 2,
  example: 5,
  figure: 4,
  note: 2,
  interactiveInline: 3,
};

const SHEET_MAX_WEIGHT = 11;

export type Sheet =
  | { kind: 'intro'; page: Page }
  | { kind: 'content'; blocks: Block[] }
  | { kind: 'exercises'; exercises: Exercise[] }
  | { kind: 'terms'; keyTerms: KeyTerm[] };

export function paginate(page: Page): Sheet[] {
  const sheets: Sheet[] = [];

  // Sheet 0: always the intro (title + learning objectives)
  sheets.push({ kind: 'intro', page });

  // Content sheets: group blocks by weight budget
  let current: Block[] = [];
  let weight = 0;

  for (const block of page.blocks) {
    const w = BLOCK_WEIGHT[block.kind] ?? 2;
    if (current.length > 0 && weight + w > SHEET_MAX_WEIGHT) {
      sheets.push({ kind: 'content', blocks: current });
      current = [];
      weight = 0;
    }
    current.push(block);
    weight += w;
  }
  if (current.length > 0) {
    sheets.push({ kind: 'content', blocks: current });
  }

  // Exercises sheet
  if (page.exercises.length > 0) {
    sheets.push({ kind: 'exercises', exercises: page.exercises });
  }

  // Key terms sheet
  if (page.keyTerms.length > 0) {
    sheets.push({ kind: 'terms', keyTerms: page.keyTerms });
  }

  return sheets;
}
