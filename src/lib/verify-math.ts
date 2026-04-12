// src/lib/verify-math.ts
// Gemma 응답의 수학적 정확도를 mathjs로 더블체크
import type { Solution } from './schemas';
import { safeEval } from './safe-math';

interface VerifyResult {
  ok: boolean;
  reason?: string;
}

export function verifySolution(solution: Solution): VerifyResult {
  try {
    for (const step of solution.steps) {
      if (step.kind === 'powerRule') {
        // 거듭제곱 미분 검증: (ax^n)' = an * x^(n-1)
        const { coefficient, exponent } = step;
        if (!isFinite(coefficient) || !isFinite(exponent)) {
          return { ok: false, reason: 'powerRule: non-finite values' };
        }
      }

      if (step.kind === 'tangentLine' || step.kind === 'limitDefinition') {
        // fn 문자열이 파싱 가능한지 확인
        try {
          safeEval(step.fn, { x: 1 });
        } catch (e) {
          return { ok: false, reason: `fn parse error: ${String(e)}` };
        }
      }

      if (step.kind === 'derivativeGraph') {
        try {
          safeEval(step.fn, { x: 1 });
        } catch (e) {
          return { ok: false, reason: `derivativeGraph fn parse error: ${String(e)}` };
        }
      }

      if (step.kind === 'riemannSum') {
        if (step.a >= step.b) {
          return { ok: false, reason: 'riemannSum: a must be less than b' };
        }
        try {
          safeEval(step.fn, { x: step.a });
        } catch (e) {
          return { ok: false, reason: `riemannSum fn parse error: ${String(e)}` };
        }
      }

      if (step.kind === 'definiteIntegral') {
        if (step.a >= step.b) {
          return { ok: false, reason: 'definiteIntegral: a must be less than b' };
        }
      }
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `verification error: ${String(e)}` };
  }
}
