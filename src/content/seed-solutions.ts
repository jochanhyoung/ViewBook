import type { Solution } from '@/lib/schemas';

// 10개 시드 문제 — Gemma 호출 없이 100% 정확한 풀이
export const seedSolutions: Solution[] = [
  // 거듭제곱 미분 1
  {
    problemText: 'f(x)=3x^4 미분',
    topic: 'powerRule',
    steps: [
      { kind: 'powerRule', coefficient: 3, exponent: 4 },
      { kind: 'text', markdown: '**결과:** $f\'(x) = 12x^3$' },
    ],
    finalAnswer: "f'(x) = 12x^3",
  },
  // 거듭제곱 미분 2
  {
    problemText: 'f(x)=x^10 미분',
    topic: 'powerRule',
    steps: [
      { kind: 'powerRule', coefficient: 1, exponent: 10 },
      { kind: 'text', markdown: '**결과:** $f\'(x) = 10x^9$' },
    ],
    finalAnswer: "f'(x) = 10x^9",
  },
  // 거듭제곱 미분 3
  {
    problemText: 'f(x)=(1/2)x^6 미분',
    topic: 'powerRule',
    steps: [
      { kind: 'powerRule', coefficient: 0.5, exponent: 6 },
      { kind: 'text', markdown: '**결과:** $f\'(x) = 3x^5$' },
    ],
    finalAnswer: "f'(x) = 3x^5",
  },
  // 합·차 미분 1
  {
    problemText: 'f(x)=x^3-2x^2+x 미분',
    topic: 'polynomialDerivative',
    steps: [
      { kind: 'text', markdown: '각 항을 차례로 미분합니다.' },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: 'x^3 - 2x^2 + x' }, { label: '미분', latex: '3x^2 - 4x + 1', highlight: true } ] },
      { kind: 'derivativeGraph', fnLatex: 'x^3-2x^2+x', fn: 'x^3-2*x^2+x', domain: [-1, 3] },
    ],
    finalAnswer: "f'(x) = 3x^2 - 4x + 1",
  },
  // 합·차 미분 2
  {
    problemText: 'f(x)=2x^5+3x^2-7 미분',
    topic: 'polynomialDerivative',
    steps: [
      { kind: 'text', markdown: '각 항에 거듭제곱 미분법을 적용합니다.' },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: '2x^5 + 3x^2 - 7' }, { label: '미분', latex: '10x^4 + 6x', highlight: true } ] },
    ],
    finalAnswer: "f'(x) = 10x^4 + 6x",
  },
  // 접선 방정식 1
  {
    problemText: 'y=x^2 위 x=1에서 접선',
    topic: 'tangentLine',
    steps: [
      { kind: 'text', markdown: '$f(x)=x^2$에서 $f\'(x)=2x$. $x=1$에서 기울기: $f\'(1)=2$.' },
      { kind: 'tangentLine', fn: 'x^2', x0: 1, domain: [-1, 3] },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: 'y - 1 = 2(x - 1)' }, { label: '전개 및 이항', latex: 'y = 2x - 1', highlight: true } ] },
    ],
    finalAnswer: 'y = 2x - 1',
  },
  // 접선 방정식 2
  {
    problemText: 'y=x^3 위 x=-1에서 접선',
    topic: 'tangentLine',
    steps: [
      { kind: 'text', markdown: '$f(x)=x^3$에서 $f\'(x)=3x^2$. $x=-1$에서 기울기: $f\'(-1)=3$.' },
      { kind: 'tangentLine', fn: 'x^3', x0: -1, domain: [-2.5, 1.5] },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: 'y + 1 = 3(x + 1)' }, { label: '전개 및 이항', latex: 'y = 3x + 2', highlight: true } ] },
    ],
    finalAnswer: 'y = 3x + 2',
  },
  // 정적분 1
  {
    problemText: '∫₀¹ x² dx',
    topic: 'definiteIntegral',
    steps: [
      { kind: 'riemannSum', fn: 'x^2', a: 0, b: 1, n: 16, method: 'right' },
      { kind: 'definiteIntegral', fn: 'x^2', a: 0, b: 1 },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: '\\left[\\frac{x^3}{3}\\right]_0^1' }, { label: '계산', latex: '\\frac{1}{3}', highlight: true } ] },
    ],
    finalAnswer: '1/3',
  },
  // 정적분 2
  {
    problemText: '∫₁² (2x+1) dx',
    topic: 'definiteIntegral',
    steps: [
      { kind: 'definiteIntegral', fn: '2*x + 1', a: 1, b: 2 },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: '[x^2 + x]_1^2' }, { label: '대입', latex: '(4+2)-(1+1)' }, { label: '계산', latex: '4', highlight: true } ] },
    ],
    finalAnswer: '4',
  },
  // 정적분 3
  {
    problemText: '∫₀² (x³-x) dx',
    topic: 'definiteIntegral',
    steps: [
      { kind: 'definiteIntegral', fn: 'x^3 - x', a: 0, b: 2 },
      { kind: 'equationTransform', steps: [ { label: '원식', latex: '\\left[\\frac{x^4}{4} - \\frac{x^2}{2}\\right]_0^2' }, { label: '대입 및 계산', latex: '(4-2)-0 = 2', highlight: true } ] },
    ],
    finalAnswer: '2',
  },
];
