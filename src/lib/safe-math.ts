// src/lib/safe-math.ts
// mathjs 샌드박싱 — 화이트리스트 노드 타입만 허용
import { create, all } from 'mathjs';
import { normalizeExpr } from './normalize-expr';

export const safeMath = create(all);

// 위험한 함수들 차단
safeMath.import(
  {
    import: () => {
      throw new Error('blocked: import');
    },
    createUnit: () => {
      throw new Error('blocked: createUnit');
    },
  },
  { override: true }
);

const ALLOWED_NODE_TYPES = new Set([
  'ConstantNode',
  'SymbolNode',
  'OperatorNode',
  'ParenthesisNode',
  'FunctionNode',
  'AccessorNode',
]);

const ALLOWED_FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'log',
  'exp',
  'sqrt',
  'abs',
  'ceil',
  'floor',
  'round',
  'pow',
]);

export function safeParseFn(expr: string) {
  if (!expr || typeof expr !== 'string') throw new Error('invalid_expr');
  if (expr.length > 200) throw new Error('expr_too_long');

  // 기본 문자 화이트리스트 (정규화 전 원본 검사)
  if (!/^[0-9a-zA-Z\s\+\-\*\/\^\(\)\.\,_]+$/.test(expr)) {
    throw new Error('invalid_characters');
  }

  // 암시적 곱셈 → 명시적 * 로 정규화 (예: (x-1)(x-2) → (x-1)*(x-2))
  const normalized = normalizeExpr(expr);
  if (normalized.length > 400) throw new Error('expr_too_long');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any;
  try {
    node = safeMath.parse(normalized);
  } catch {
    throw new Error('parse_error');
  }

  node.traverse((n: { type: string; name?: string }) => {
    if (!ALLOWED_NODE_TYPES.has(n.type)) {
      throw new Error(`blocked_node:${n.type}`);
    }
    if (n.type === 'FunctionNode' && n.name && !ALLOWED_FUNCTIONS.has(n.name)) {
      throw new Error(`blocked_function:${n.name}`);
    }
  });

  return node.compile();
}

export function safeEval(expr: string, scope: Record<string, number> = {}): number {
  const compiled = safeParseFn(expr);
  const result = compiled.evaluate(scope);
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('invalid_result');
  }
  return result;
}
