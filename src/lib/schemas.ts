import { z } from 'zod';

export const VisualizationStepSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('powerRule'), coefficient: z.number(), exponent: z.number() }),
  z.object({ kind: z.literal('limitDefinition'), fn: z.string().max(200), x0: z.number() }),
  z.object({ kind: z.literal('clockAngle'), hour: z.number(), minute: z.number(), interactive: z.boolean().optional() }),
  z.object({ kind: z.literal('saltConcentration'), water: z.number(), salt: z.number(), interactive: z.boolean().optional() }),
  z.object({ kind: z.literal('calendarPattern'), day: z.number().int().min(1).max(31), interactive: z.boolean().optional() }),
  z.object({ kind: z.literal('distanceTime'), speed: z.number() }),
  z.object({ kind: z.literal('linearFunction'), slope: z.number(), intercept: z.number(), interactive: z.boolean().optional() }),
  z.object({ kind: z.literal('quadraticFunction'), a: z.number(), interactive: z.boolean().optional() }),
  z.object({
    kind: z.literal('systemOfEquations'),
    line1: z.object({ slope: z.number(), intercept: z.number() }),
    line2: z.object({ slope: z.number(), intercept: z.number() }),
  }),
  z.object({
    kind: z.literal('piecewiseGraph'),
    x0: z.number(),
    pieces: z.array(z.object({
      fn: z.string().max(200),
      fnLatex: z.string().max(200),
      condition: z.string().max(100),
      domain: z.tuple([z.number(), z.number()]),
    })).min(2).max(6),
  }),
  z.object({
    kind: z.literal('derivativeGraph'),
    fnLatex: z.string().max(200),
    fn: z.string().max(200),
    domain: z.tuple([z.number(), z.number()]),
  }),
  z.object({
    kind: z.literal('tangentLine'),
    fn: z.string().max(200),
    x0: z.number(),
    domain: z.tuple([z.number(), z.number()]),
  }),
  z.object({
    kind: z.literal('riemannSum'),
    fn: z.string().max(200),
    a: z.number(),
    b: z.number(),
    n: z.number().int().min(1).max(1024),
    method: z.enum(['left', 'right', 'midpoint']),
  }),
  z.object({ kind: z.literal('definiteIntegral'), fn: z.string().max(200), a: z.number(), b: z.number() }),
  z.object({
    kind: z.literal('equationTransform'),
    steps: z.array(z.object({
      label: z.string().max(50),
      latex: z.string().max(200),
      description: z.string().max(200).optional(),
      highlight: z.boolean().optional()
    })).min(1).max(10),
  }),
  z.object({
    kind: z.literal('text'),
    latex: z.string().max(500).optional(),
    markdown: z.string().max(1000).optional(),
  }),
  z.object({
    kind: z.literal('playground'),
    initialFn: z.string().max(200),
    domain: z.tuple([z.number(), z.number()]),
  }),
  z.object({
    kind: z.literal('solutionSlides'),
    steps: z.array(z.object({
      label: z.string().max(80),
      tex: z.string().max(400),
      hint: z.string().max(200).optional(),
      final: z.boolean().optional(),
    })).min(1).max(12),
  }),
  z.object({
    kind: z.literal('secantSlope'),
    fn: z.string().max(200),
    a: z.number(),
    interactive: z.boolean().optional(),
  }),
]);

export const SolutionSchema = z.object({
  problemText: z.string().max(1000),
  topic: z.enum(['powerRule', 'polynomialDerivative', 'tangentLine', 'definiteIntegral', 'other']),
  steps: z.array(VisualizationStepSchema).min(1).max(12),
  finalAnswer: z
    .string()
    .max(200)
    .refine(
      (s) => !/[<>]|javascript:|data:/i.test(s),
      { message: 'finalAnswer contains disallowed content' }
    ),
});

export type Solution = z.infer<typeof SolutionSchema>;
