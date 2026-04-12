// src/lib/__tests__/normalize-expr.test.ts
// Run with: node --experimental-strip-types src/lib/__tests__/normalize-expr.test.ts
// (No test framework required — uses simple assertions)

import { normalizeExpr } from '../normalize-expr';
import { safeParseFn } from '../safe-math';

function evalAt(raw: string, x: number): number {
  const compiled = safeParseFn(raw);
  return compiled.evaluate({ x }) as number;
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) < tol;
}

console.log('\n── normalizeExpr unit tests ──\n');

// Case 1: implicit product of parenthesised factors
assert(
  normalizeExpr('(x-1)(x-2)(x-3)(x-4)(x-5)') === '(x-1)*(x-2)*(x-3)*(x-4)*(x-5)',
  '(x-1)(x-2)... → (x-1)*(x-2)...'
);

// Case 2: f(2) = 0 for roots at 1,2,3,4,5
assert(approx(evalAt('(x-1)(x-2)(x-3)(x-4)(x-5)', 2), 0), 'f(2)=0');

// Case 3: f(0) = (-1)(-2)(-3)(-4)(-5) = -120
assert(approx(evalAt('(x-1)(x-2)(x-3)(x-4)(x-5)', 0), -120), 'f(0)=-120');

// Case 4: f(1.5) ≈ -3.28125
assert(approx(evalAt('(x-1)(x-2)(x-3)(x-4)(x-5)', 1.5), -3.28125), 'f(1.5)≈-3.28125');

// Case 5: 2x^2 + 3x - 1, f(2) = 8+6-1 = 13
assert(
  normalizeExpr('2x^2+3x-1') === '2*x^2+3*x-1',
  '2x^2+3x-1 → 2*x^2+3*x-1'
);
assert(approx(evalAt('2x^2+3x-1', 2), 13), 'f(2)=13');

// Case 6: 3(x+1)^2, f(1) = 3*4 = 12
assert(
  normalizeExpr('3(x+1)^2') === '3*(x+1)^2',
  '3(x+1)^2 → 3*(x+1)^2'
);
assert(approx(evalAt('3(x+1)^2', 1), 12), 'f(1)=12');

// Case 7: x(x-1)(x+1), f(2) = 2*1*3 = 6
assert(
  normalizeExpr('x(x-1)(x+1)') === 'x*(x-1)*(x+1)',
  'x(x-1)(x+1) → x*(x-1)*(x+1)'
);
assert(approx(evalAt('x(x-1)(x+1)', 2), 6), 'f(2)=6');

// Case 8: sin(x) + cos(2x), f(0) = 0 + 1 = 1
// sin/cos must NOT be split to s*i*n
assert(approx(evalAt('sin(x)+cos(2x)', 0), 1), 'sin(x)+cos(2x): f(0)=1');

// Case 9: 2sin(x), f(π/2) = 2
assert(approx(evalAt('2sin(x)', Math.PI / 2), 2, 1e-4), '2sin(x): f(π/2)=2');

// Case 10: sqrt(x+1), f(3) = 2
assert(approx(evalAt('sqrt(x+1)', 3), 2), 'sqrt(x+1): f(3)=2');

// Case 11: zero roots — all five roots of (x-1)(x-2)(x-3)(x-4)(x-5) are exactly 0
for (const root of [1, 2, 3, 4, 5]) {
  assert(
    Math.abs(evalAt('(x-1)(x-2)(x-3)(x-4)(x-5)', root)) < 1e-6,
    `f(${root})≈0`
  );
}

console.log('\n── All tests passed ──\n');
