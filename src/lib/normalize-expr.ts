const FUNCS = [
  'asin', 'acos', 'atan', 'sqrt', 'sin', 'cos', 'tan',
  'abs', 'log', 'exp', 'ln', 'ceil', 'floor', 'round', 'pow'
];

export function normalizeExpr(raw: string): string {
  let expr = raw.trim();

  // 1. 허용 함수명 플레이스홀더로 보호
  const placeholders: Record<string, string> = {};
  FUNCS.forEach((fn, i) => {
    const key = `__FN${i}__`;
    placeholders[key] = fn;
    expr = expr.replace(new RegExp(`\\b${fn}\\b`, 'g'), key);
  });

  // 2. ^ 를 ** 로 변환 (생략 가능, mathjs pow 처리)
  
  // 3. 암시적 곱셈 삽입
  expr = expr.replace(/\)\s*\(/g, ')*(');        // )( → )*(
  expr = expr.replace(/(\d)\s*\(/g, '$1*(');     // 3( → 3*(
  expr = expr.replace(/([a-zA-Z])\s*\(/g, (match, char) => {
    // 플레이스홀더(__FN0__ 등)는 건드리지 않음
    if (char === '_') return match;
    return `${char}*(`;
  });

  // 4. 플레이스홀더 복원
  Object.entries(placeholders).forEach(([key, fn]) => {
    expr = expr.replace(new RegExp(key, 'g'), fn);
  });

  // 5. 괄호 균형 검사
  let depth = 0;
  for (const ch of expr) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) throw new Error('괄호 불일치');
  }
  if (depth !== 0) throw new Error('괄호 불일치');

  return expr;
}
