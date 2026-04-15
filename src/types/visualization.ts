// src/types/visualization.ts
// fnLatex = KaTeX 렌더용, fn = mathjs 계산용 — 반드시 분리

export type VisualizationStep =
  | { kind: 'powerRule'; coefficient: number; exponent: number }
  | { kind: 'limitDefinition'; fn: string; x0: number }
  | { kind: 'clockAngle'; hour: number; minute: number; interactive?: boolean }
  | { kind: 'saltConcentration'; water: number; salt: number; interactive?: boolean }
  | { kind: 'calendarPattern'; day: number; interactive?: boolean }
  | { kind: 'distanceTime'; speed: number; sampleTime?: number; interactive?: boolean }
  | { kind: 'linearFunction'; slope: number; intercept: number; interactive?: boolean }
  | { kind: 'quadraticFunction'; a: number; interactive?: boolean }
  | {
      kind: 'systemOfEquations';
      line1: { slope: number; intercept: number };
      line2: { slope: number; intercept: number };
    }
  | {
      kind: 'piecewiseGraph';
      x0: number;
      pieces: { fn: string; fnLatex: string; condition: string; domain: [number, number] }[];
    }
  | { kind: 'derivativeGraph'; fnLatex: string; fn: string; domain: [number, number] }
  | { kind: 'tangentLine'; fn: string; x0: number; domain: [number, number] }
  | {
      kind: 'riemannSum';
      fn: string;
      a: number;
      b: number;
      n: number;
      method: 'left' | 'right' | 'midpoint';
    }
  | { kind: 'definiteIntegral'; fn: string; a: number; b: number }
  | { kind: 'equationTransform'; steps: { label: string; latex: string; description?: string; highlight?: boolean }[] }
  | { kind: 'text'; latex?: string; markdown?: string }
  | { kind: 'playground'; initialFn: string; domain: [number, number] }
  | { kind: 'solutionSlides'; steps: { label: string; tex: string; hint?: string; final?: boolean }[] }
  | { kind: 'coordinatePlane'; points?: { x: number; y: number; label?: string }[]; interactive?: boolean };
