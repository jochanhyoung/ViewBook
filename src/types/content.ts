// src/types/content.ts
import type { VisualizationStep } from './visualization';

export type Block =
  | { kind: 'lead'; markdown: string }
  | { kind: 'heading'; level: 1 | 2 | 3; number?: string; text: string; eyebrow?: string }
  | { kind: 'paragraph'; markdown: string }
  | { kind: 'definition'; id: string; term: string; body: string }
  | { kind: 'theorem'; id: string; number: string; statement: string; proof?: string }
  | { kind: 'equation'; latex: string; caption?: string; id?: string }
  | { kind: 'keyPoint'; markdown: string }
  | {
      kind: 'example';
      id: string;
      number: string;
      problem: string;
      hint?: string;
      solution: string;
      visualize: VisualizationStep[];
    }
  | { kind: 'figure'; visualization: VisualizationStep; caption: string }
  | { kind: 'note'; variant: 'info' | 'history' | 'tip'; markdown: string }
  | {
      kind: 'interactiveInline';
      component: 'limitSlider' | 'tangentDrag' | 'functionPlayground';
      props: Record<string, unknown>;
    }
  | { kind: 'video'; src: string; title?: string };

export interface Exercise {
  id: string;
  number: string;
  problem: string;
  hints: string[];
  solution: string;
  visualize: VisualizationStep[];
}

export interface KeyTerm {
  term: string;
  short: string;
  full?: string;
}

export interface LearningObjective {
  id: string;
  text: string;
}

export interface Page {
  slug: string;
  chapter: string;
  section: string;
  number: string;
  title: string;
  subtitle?: string;
  learningObjectives: LearningObjective[];
  blocks: Block[];
  keyTerms: KeyTerm[];
  exercises: Exercise[];
}
