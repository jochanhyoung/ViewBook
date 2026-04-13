'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import { safeParseFn, safeEval } from '@/lib/safe-math';
import { useTheme } from '@/components/ThemeProvider';

interface FunctionPlaygroundProps {
  initialFn: string;
  domain: [number, number];
}

interface CriticalPoint {
  x: number;
  y: number;
  type: 'max' | 'min';
}

const HISTORY_KEY = 'playground_history';
const MAX_HISTORY = 5;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function refineExtremum(expr: any, lo: number, hi: number, type: 'max' | 'min', iterations = 30): CriticalPoint | null {
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = lo, b = hi;
  for (let i = 0; i < iterations; i++) {
    const c = b - phi * (b - a);
    const d = a + phi * (b - a);
    let fc: number, fd: number;
    try { fc = expr.evaluate({ x: c }); } catch { return null; }
    try { fd = expr.evaluate({ x: d }); } catch { return null; }
    if (!isFinite(fc) || !isFinite(fd)) return null;
    if (type === 'max') {
      if (fc < fd) a = c; else b = d;
    } else {
      if (fc > fd) a = c; else b = d;
    }
  }
  const x = (a + b) / 2;
  let y: number;
  try { y = expr.evaluate({ x }); } catch { return null; }
  if (!isFinite(y)) return null;
  return { x, y, type };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findCriticalPoints(compiledExpr: any, xMin: number, xMax: number): CriticalPoint[] {
  const SAMPLES = 2000;
  const xs = Array.from({ length: SAMPLES }, (_, i) => xMin + (i / (SAMPLES - 1)) * (xMax - xMin));
  const ys = xs.map(x => {
    try { const y = compiledExpr.evaluate({ x }); return isFinite(y) ? y : NaN; }
    catch { return NaN; }
  });

  const points: CriticalPoint[] = [];
  for (let i = 1; i < ys.length - 1; i++) {
    const prev = ys[i - 1], cur = ys[i], next = ys[i + 1];
    if (!isFinite(prev) || !isFinite(cur) || !isFinite(next)) continue;
    if (cur > prev && cur > next) {
      const refined = refineExtremum(compiledExpr, xs[i - 1], xs[i + 1], 'max');
      if (refined) points.push(refined);
    }
    if (cur < prev && cur < next) {
      const refined = refineExtremum(compiledExpr, xs[i - 1], xs[i + 1], 'min');
      if (refined) points.push(refined);
    }
  }

  // 중복 제거 (x좌표 0.1 이내는 하나로 병합)
  return points.filter((p, i) =>
    points.findIndex(q => Math.abs(q.x - p.x) < 0.1) === i
  );
}

function formatCriticalLabel(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-4) return String(Math.round(n));
  return (Math.round(n * 1000) / 1000).toFixed(3);
}

export function FunctionPlayground({ initialFn, domain }: FunctionPlaygroundProps) {
  const { theme } = useTheme();

  /*
   * ── 테마별 SVG 색상 — 불투명 단색만 사용 ───────────────────────────────
   *
   * WCAG 대비비 검증 ──
   * 다크 (#0c0d11):
   *   gridLabel #9aa0b4  → 5.9:1  (AA  ✓)
   *   coordText #ffffff  → 19.6:1 (AAA ✓)
   *   critMax   #7dd3fc  → 9.8:1  (AAA ✓)
   *   critMin   #fda4af  → 7.2:1  (AAA ✓)
   * 라이트 (#f0f2f5):
   *   gridLabel #4a4f63  → 6.2:1  (AA  ✓)
   *   coordText #0a0a0f  → 18.4:1 (AAA ✓)
   *   critMax   #0369a1  → 6.8:1  (AA  ✓)
   *   critMin   #be123c  → 6.1:1  (AA  ✓)
   */
  const COLORS = {
    grid:          theme === 'dark' ? '#1a1b22' : '#d8d9e0',
    gridLabel:     theme === 'dark' ? '#9aa0b4' : '#4a4f63',
    rootFill:      theme === 'dark' ? '#D4FF4F' : '#2d4a00',
    rootBorder:    theme === 'dark' ? '#6a8030' : '#4a6a10',
    rootBoxBg:     theme === 'dark' ? '#16171e' : '#ffffff',
    rootBoxHover:  theme === 'dark' ? '#2a3020' : '#e6ecd8',
    rootLeadLine:  theme === 'dark' ? '#3a4a20' : '#7a9a40',
    critMax:       theme === 'dark' ? '#7dd3fc' : '#0369a1',
    critMin:       theme === 'dark' ? '#fda4af' : '#be123c',
    critMaxDim:    theme === 'dark' ? '#3a6a80' : '#4a8ab0',
    critMinDim:    theme === 'dark' ? '#804050' : '#a04060',
    critMaxHover:  theme === 'dark' ? '#1a2a35' : '#daeaf5',
    critMinHover:  theme === 'dark' ? '#2a1a20' : '#f5dae0',
    critMaxBtnBg:  theme === 'dark' ? '#121a20' : '#e8f0f8',
    critMinBtnBg:  theme === 'dark' ? '#1a1215' : '#f8e8ec',
    critMaxBtnHov: theme === 'dark' ? '#1a2530' : '#d0e5f0',
    critMinBtnHov: theme === 'dark' ? '#251a20' : '#f0d0d8',
    critMaxBtnBdr: theme === 'dark' ? '#3a6a80' : '#4a8ab0',
    critMinBtnBdr: theme === 'dark' ? '#804050' : '#a04060',
    coordText:     theme === 'dark' ? '#ffffff' : '#0a0a0f',
    queryLine:     theme === 'dark' ? '#3a4a20' : '#7a9a40',
    queryLabel:    theme === 'dark' ? '#ffffff' : '#0a0a0f',
    btnSecText:    theme === 'dark' ? '#9aa0b4' : '#4a4f63',
  } as const;

  const [fnExpr, setFnExpr] = useState<string | null>(initialFn);
  const [inputVal, setInputVal] = useState(initialFn);
  const [error, setError] = useState<string | null>(null);
  const [showDerivative, setShowDerivative] = useState(false);
  const [tangentX, setTangentX] = useState<number | null>(null);
  const [autoDomain, setAutoDomain] = useState<{ xMin: number, xMax: number, yMin: number, yMax: number } | null>(null);
  const [roots, setRoots] = useState<number[]>([]);
  const [criticalPoints, setCriticalPoints] = useState<CriticalPoint[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [queryX, setQueryX] = useState('');
  const [hoveredRoot, setHoveredRoot] = useState<number | null>(null);
  const [hoveredCritical, setHoveredCritical] = useState<CriticalPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 마운트 시 localStorage에서 히스토리 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch { /* 무시 */ }
  }, []);

  const addToHistory = useCallback((expr: string) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      const updated = [expr, ...prev.filter(e => e !== expr)].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch { /* 무시 */ }
  }, []);

  const W = 420, H_SVG = 280;
  const DERIV_H = 0.001;

  const evalFn = useCallback(
    (x: number, expr: string | null) => {
      if (!expr) return NaN;
      try { return safeEval(expr, { x }); } catch { return NaN; }
    },
    []
  );

  const evalDeriv = useCallback(
    (x: number, expr: string | null) => {
      if (!expr) return NaN;
      const f1 = evalFn(x + DERIV_H, expr);
      const f0 = evalFn(x - DERIV_H, expr);
      return (f1 - f0) / (2 * DERIV_H);
    },
    [evalFn]
  );

  let xMin = domain[0];
  let xMax = domain[1];
  let yMin = -3;
  let yMax = 3;

  if (autoDomain) {
    xMin = autoDomain.xMin;
    xMax = autoDomain.xMax;
    yMin = autoDomain.yMin;
    yMax = autoDomain.yMax;
  } else {
    const yVals: number[] = [];
    if (fnExpr) {
      for (let i = 0; i <= 100; i++) {
        const x = xMin + (i / 100) * (xMax - xMin);
        const y = evalFn(x, fnExpr);
        if (isFinite(y)) yVals.push(y);
        if (showDerivative) {
          const dy = evalDeriv(x, fnExpr);
          if (isFinite(dy)) yVals.push(dy);
        }
      }
    }
    const rawMin = yVals.length ? Math.min(...yVals) : -3;
    const rawMax = yVals.length ? Math.max(...yVals) : 3;
    const pad = Math.max(0.5, (rawMax - rawMin) * 0.15);
    yMin = rawMin - pad;
    yMax = rawMax + pad;
  }

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number) { return H_SVG - ((y - yMin) / (yMax - yMin)) * H_SVG; }
  function fromSvgX(svgX: number) { return xMin + (svgX / W) * (xMax - xMin); }

  // y축 눈금 계산
  const yTicks = useMemo(() => {
    const range = yMax - yMin;
    if (range <= 0) return [];
    const rawStep = range / 6;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = Math.ceil(rawStep / magnitude) * magnitude;
    const ticks: number[] = [];
    let y = Math.ceil(yMin / step) * step;
    while (y <= yMax) {
      if (Math.abs(y) > step * 0.01) ticks.push(y);
      y = Math.round((y + step) * 1e10) / 1e10;
    }
    return ticks;
  }, [yMin, yMax]);

  // x값 조회 결과
  const queryResult = useMemo(() => {
    if (!fnExpr || queryX === '') return null;
    const xNum = parseFloat(queryX);
    if (isNaN(xNum)) return null;
    try {
      const y = evalFn(xNum, fnExpr);
      const dy = evalDeriv(xNum, fnExpr);
      return {
        y: isFinite(y) ? formatNum(y) : '정의 안 됨',
        dy: isFinite(dy) ? formatNum(dy) : '정의 안 됨',
        xNum,
        yNum: y,
      };
    } catch {
      return null;
    }
  }, [queryX, fnExpr, evalFn, evalDeriv]);

  function buildPath(expr: string | null): string {
    if (!expr) return '';
    const pts: string[] = [];
    const CURVE_SAMPLES = Math.max(1000, Math.ceil((xMax - xMin) * 200));
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const x = xMin + (i / CURVE_SAMPLES) * (xMax - xMin);
      const y = evalFn(x, expr);
      if (!isFinite(y) || Math.abs(y) > 1e6) {
        pts.push('');
        continue;
      }
      pts.push(`${i === 0 || pts.length === 0 || pts[pts.length - 1] === '' ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
    }
    return pts.filter(Boolean).join(' ');
  }

  const fnPath = buildPath(fnExpr);

  // 도함수 폴리라인
  const derivPoints: string[] = [];
  if (showDerivative && fnExpr) {
    for (let i = 0; i <= 300; i++) {
      const x = xMin + (i / 300) * (xMax - xMin);
      const dy = evalDeriv(x, fnExpr);
      if (!isFinite(dy)) continue;
      derivPoints.push(`${toX(x).toFixed(1)},${toY(dy).toFixed(1)}`);
    }
  }

  const errorMessage = (code: string): string => {
    if (code === 'expr_too_long') return '식이 너무 깁니다 (200자 이내)';
    if (code === 'invalid_characters') return '허용되지 않는 문자가 포함되어 있어요. (숫자, 영문, +−×÷^() 사용)';
    if (code === 'parse_error') return '수식을 확인해주세요';
    if (code.startsWith('blocked_function:')) {
      const fn = code.replace('blocked_function:', '');
      return `"${fn}" 함수는 사용할 수 없어요. (허용: sin, cos, log, exp, sqrt, abs)`;
    }
    if (code.startsWith('blocked_node:')) return '허용되지 않은 문법이 포함되어 있어요.';
    return '수식을 확인해주세요';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const computeInitialDomain = (compiledExpr: any) => {
    try {
      const SAMPLES = 2000;
      const searchRange = [-20, 20];
      const xs = Array.from({ length: SAMPLES }, (_, i) =>
        searchRange[0] + (i / (SAMPLES - 1)) * (searchRange[1] - searchRange[0])
      );
      const ys = xs.map(x => {
        try {
          const y = compiledExpr.evaluate({ x });
          return isFinite(y) ? y : NaN;
        } catch { return NaN; }
      });

      const computedRoots: number[] = [];
      for (let i = 0; i < ys.length - 1; i++) {
        if (!isNaN(ys[i]) && !isNaN(ys[i + 1])) {
          if (ys[i] === 0 && ys[i + 1] !== 0) {
            computedRoots.push(xs[i]);
          } else if (ys[i] * ys[i + 1] < 0) {
            computedRoots.push((xs[i] + xs[i + 1]) / 2);
          }
        }
      }
      if (ys[ys.length - 1] === 0) computedRoots.push(xs[xs.length - 1]);

      let newXMin: number, newXMax: number;
      if (computedRoots.length >= 2) {
        const rootPadding = (Math.max(...computedRoots) - Math.min(...computedRoots)) * 0.4;
        newXMin = Math.min(...computedRoots) - rootPadding;
        newXMax = Math.max(...computedRoots) + rootPadding;
      } else if (computedRoots.length === 1) {
        newXMin = computedRoots[0] - 5;
        newXMax = computedRoots[0] + 5;
      } else {
        newXMin = -10;
        newXMax = 10;
      }

      let newYMin = -10, newYMax = 10;

      if (computedRoots.length >= 2) {
        const innerXs = Array.from({ length: 800 }, (_, i) =>
          Math.min(...computedRoots) + (i / 799) * (Math.max(...computedRoots) - Math.min(...computedRoots))
        );
        const innerYs = innerXs
          .map(x => { try { return compiledExpr.evaluate({ x }); } catch { return NaN; } })
          .filter(y => isFinite(y) && !isNaN(y));

        if (innerYs.length > 0) {
          const innerMin = Math.min(...innerYs);
          const innerMax = Math.max(...innerYs);
          const amplitude = innerMax - innerMin;
          const pad = Math.max(1, amplitude * 0.5);
          newYMin = innerMin - pad;
          newYMax = innerMax + pad;
        }
      } else {
        const domainXs = Array.from({ length: 800 }, (_, i) =>
          newXMin + (i / 799) * (newXMax - newXMin)
        );
        const domainYs = domainXs
          .map(x => { try { return compiledExpr.evaluate({ x }); } catch { return NaN; } })
          .filter(y => isFinite(y) && !isNaN(y) && Math.abs(y) < 1e8);

        if (domainYs.length > 0) {
          newYMin = Math.min(...domainYs);
          newYMax = Math.max(...domainYs);
          const yPad = Math.max(1, (newYMax - newYMin) * 0.15);
          newYMin -= yPad;
          newYMax += yPad;
        }
      }

      if (newYMin === newYMax) { newYMin -= 1; newYMax += 1; }

      return { x: [newXMin, newXMax], y: [newYMin, newYMax], roots: computedRoots };
    } catch {
      return null;
    }
  };

  const handleApply = () => {
    try {
      const compiledExpr = safeParseFn(inputVal);
      setFnExpr(inputVal);
      setError(null);
      setTangentX(null);
      addToHistory(inputVal);

      const newDomain = computeInitialDomain(compiledExpr);
      if (newDomain) {
        setAutoDomain({ xMin: newDomain.x[0], xMax: newDomain.x[1], yMin: newDomain.y[0], yMax: newDomain.y[1] });
        setRoots(newDomain.roots);
        // 극대/극소 탐지 — computeInitialDomain이 결정한 x 범위 기준
        const cps = findCriticalPoints(compiledExpr, newDomain.x[0], newDomain.x[1]);
        setCriticalPoints(cps);
      } else {
        setAutoDomain({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
        setRoots([]);
        setCriticalPoints([]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      setFnExpr(null);
      setError(errorMessage(msg));
      setAutoDomain(null);
      setRoots([]);
      setCriticalPoints([]);
    }
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (error || !fnExpr) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svgX = (e.clientX - rect.left) * (W / rect.width);
    const svgY = (e.clientY - rect.top) * (H_SVG / rect.height);

    // 극대/극소 점 클릭 → queryX 자동 입력
    const clickedCritical = criticalPoints.find(p => {
      const cx = toX(p.x);
      const cy = toY(p.y);
      return Math.hypot(svgX - cx, svgY - cy) < 14;
    });
    if (clickedCritical) {
      setQueryX(String(Math.round(clickedCritical.x * 1e6) / 1e6));
      return;
    }

    // 루트 점 클릭
    const clickedRoot = roots.find((r) => {
      const cx = toX(r);
      const cy = toY(0);
      return Math.hypot(svgX - cx, svgY - cy) < 12;
    });
    if (clickedRoot !== undefined) {
      setQueryX(String(Math.round(clickedRoot * 1e6) / 1e6));
      return;
    }

    const x = fromSvgX(svgX);
    setTangentX(x);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (error || !fnExpr) {
      if (hoveredRoot !== null) setHoveredRoot(null);
      if (hoveredCritical !== null) setHoveredCritical(null);
      return;
    }
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svgX = (e.clientX - rect.left) * (W / rect.width);
    const svgY = (e.clientY - rect.top) * (H_SVG / rect.height);

    const foundCritical = criticalPoints.find(p =>
      Math.hypot(svgX - toX(p.x), svgY - toY(p.y)) < 14
    ) ?? null;
    setHoveredCritical(foundCritical);

    if (!foundCritical && roots.length > 0) {
      const foundRoot = roots.find(r =>
        Math.hypot(svgX - toX(r), svgY - toY(0)) < 12
      ) ?? null;
      setHoveredRoot(foundRoot);
    } else {
      setHoveredRoot(null);
    }
  };

  // 접선
  let tangentPoints: string | null = null;
  if (tangentX !== null && fnExpr) {
    const y0 = evalFn(tangentX, fnExpr);
    const slope = evalDeriv(tangentX, fnExpr);
    if (isFinite(y0) && isFinite(slope)) {
      const tx1 = xMin, ty1 = y0 + slope * (tx1 - tangentX);
      const tx2 = xMax, ty2 = y0 + slope * (tx2 - tangentX);
      tangentPoints = `${toX(tx1)},${toY(ty1)} ${toX(tx2)},${toY(ty2)}`;
    }
  }

  const tangentY = tangentX !== null ? evalFn(tangentX, fnExpr) : null;
  const tangentSlope = tangentX !== null ? evalDeriv(tangentX, fnExpr) : null;

  const zeroY = toY(0);

  // 커서: 극값 > 근 > 기본
  const svgCursor = error ? 'default' : (hoveredCritical || hoveredRoot) ? 'pointer' : 'crosshair';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '14px' }}>
      {/* 입력창 */}
      <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '420px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>f(x) =</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            style={{
              width: '100%',
              paddingLeft: '60px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              background: 'var(--color-bg-elevated)',
              border: `1px solid ${error ? '#ff6b6b' : 'var(--color-border)'}`,
              borderRadius: '4px',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          onClick={handleApply}
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-accent-fg)',
            padding: '0 16px',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          적용
        </button>
      </div>

      {/* KaTeX 미리보기 */}
      {inputVal.trim().length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: '420px',
          minHeight: '24px',
          padding: '6px 12px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-bg-surface)',
          borderRadius: '4px',
          fontSize: '14px',
          color: 'var(--color-text-subtle)',
          overflow: 'hidden',
        }}>
          <LatexPreview raw={inputVal} />
        </div>
      )}

      {/* 히스토리 칩 */}
      {history.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => setInputVal(h)}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-subtle)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: 'all 150ms',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-border)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-surface)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-subtle)';
              }}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* 그래프 */}
      <svg
        ref={svgRef}
        width={W}
        height={H_SVG}
        onClick={handleSvgClick}
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={() => { setHoveredRoot(null); setHoveredCritical(null); }}
        style={{ overflow: 'visible', cursor: svgCursor, maxWidth: '100%' }}
        viewBox={`0 0 ${W} ${H_SVG}`}
      >
        {error ? (
          <text
            x={W / 2} y={H_SVG / 2}
            fill="var(--color-accent)" fontFamily="var(--font-mono)" fontSize="14px"
            textAnchor="middle" dominantBaseline="middle"
          >
            {error}
          </text>
        ) : (
          <>
            {/* 1. 격자 (y축 눈금선 + 레이블) */}
            {yTicks.map((yt) => (
              <g key={`ytick-${yt}`}>
                <line
                  x1={0} y1={toY(yt)} x2={W} y2={toY(yt)}
                  stroke={COLORS.grid} strokeWidth="1" strokeDasharray="3 4"
                />
                <text
                  x={Math.max(toX(0) - 8, 4)} y={toY(yt) + 4}
                  fill={COLORS.gridLabel} fontSize="13" fontFamily="var(--font-mono)" textAnchor="end"
                >
                  {Number.isInteger(yt) ? String(yt) : yt.toFixed(1)}
                </text>
              </g>
            ))}

            {/* 2. 축 */}
            <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="var(--color-vis-axis)" strokeWidth="1" />
            <line x1={toX(0)} y1={0} x2={toX(0)} y2={H_SVG} stroke="var(--color-vis-axis)" strokeWidth="1" />

            {/* 3. 도함수 */}
            {showDerivative && derivPoints.length > 1 && (
              <polyline points={derivPoints.join(' ')} fill="none" stroke="var(--color-vis-deriv)" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.75" />
            )}

            {/* 4. 함수 곡선 */}
            <path d={fnPath} fill="none" stroke="var(--color-text)" strokeWidth="2" />

            {/* 5. 근 강조 표시 + 레이블 */}
            {roots.map((rx, idx) => {
              const cx = toX(rx);
              const cy = toY(0);
              const prevCx = idx > 0 ? toX(roots[idx - 1]) : -Infinity;
              const isCrowded = cx - prevCx < 60;
              const above = isCrowded && idx % 2 === 1;
              const labelY = above ? cy - 20 : cy + 14;
              const label = formatRootLabel(rx);
              const isHovered = hoveredRoot === rx;
              return (
                <g key={`root-${idx}`}>
                  <circle cx={cx} cy={cy} r={isHovered ? 5 : 3.5} fill={COLORS.rootFill} />
                  <rect
                    x={cx - label.length * 3.5 - 6}
                    y={labelY - 10}
                    width={label.length * 7 + 12}
                    height={18}
                    rx={4}
                    fill={isHovered ? COLORS.rootBoxHover : COLORS.rootBoxBg}
                    stroke={COLORS.rootBorder}
                    strokeWidth={1}
                  />
                  <text
                    x={cx} y={labelY + 3}
                    fill={COLORS.rootFill} fontSize="14" fontFamily="var(--font-mono)" fontWeight={600} textAnchor="middle"
                  >
                    {label}
                  </text>
                  {above && (
                    <line x1={cx} y1={cy - 4} x2={cx} y2={labelY + 8} stroke={COLORS.rootLeadLine} strokeWidth={1} />
                  )}
                </g>
              );
            })}

            {/* 6. 극대/극소점 */}
            {criticalPoints.map((p, idx) => {
              const cx = toX(p.x);
              const cy = toY(p.y);
              const isMax = p.type === 'max';
              const isHov = hoveredCritical !== null && Math.abs(hoveredCritical.x - p.x) < 0.001;
              const dotColor = isMax ? COLORS.critMax : COLORS.critMin;
              const leadStroke = isMax ? COLORS.critMaxDim : COLORS.critMinDim;
              const borderColor = isMax ? COLORS.critMax : COLORS.critMin;
              // 완전 불투명 배경, 호버 시에만 tint
              const bgFill = isHov
                ? (isMax ? COLORS.critMaxHover : COLORS.critMinHover)
                : 'var(--color-bg)';

              const line1 = isMax ? '극대' : '극소';
              const line2 = `x = ${formatCriticalLabel(p.x)}`;
              const line3 = `y = ${formatCriticalLabel(p.y)}`;
              const maxLen = Math.max(line1.length, line2.length, line3.length);
              const boxW = Math.max(58, maxLen * 7 + 16);
              const boxH = 54;

              // Task 1: 곡선 반대 방향으로 충분한 offset (최소 16px)
              // Task 2: 상/하단 경계 clamp
              const rawBoxY = isMax ? cy - boxH - 16 : cy + 16;
              const clampedBoxY = Math.max(4, Math.min(rawBoxY, H_SVG - boxH - 4));
              // x축 경계 clamp
              const boxX = Math.min(Math.max(cx - boxW / 2, 2), W - boxW - 2);

              // Task 5: 리드선 끝점 (박스와 점을 연결)
              const leadEndY = isMax ? clampedBoxY + boxH : clampedBoxY;

              return (
                <g key={`cp-${idx}`}>
                  {/* Task 5: 리드선 — 점 → 레이블 박스 가장 가까운 모서리 */}
                  <line
                    x1={cx} y1={cy}
                    x2={boxX + boxW / 2} y2={leadEndY}
                    stroke={leadStroke} strokeWidth="1" strokeDasharray="3 3"
                  />
                  {/* Task 3: 완전 불투명 배경 + 1.5px 테두리 */}
                  <rect
                    x={boxX} y={clampedBoxY} width={boxW} height={boxH} rx={6}
                    fill={bgFill} stroke={borderColor} strokeWidth="1.5"
                  />
                  {/* 타입 텍스트 */}
                  <text
                    x={boxX + boxW / 2} y={clampedBoxY + 15}
                    fill={dotColor} fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle"
                  >
                    {line1}
                  </text>
                  {/* x 좌표 */}
                  <text
                    x={boxX + boxW / 2} y={clampedBoxY + 30}
                    fill={COLORS.coordText} fontSize="14" fontFamily="var(--font-mono)" fontWeight="500" textAnchor="middle"
                  >
                    {line2}
                  </text>
                  {/* y 좌표 */}
                  <text
                    x={boxX + boxW / 2} y={clampedBoxY + 44}
                    fill={COLORS.coordText} fontSize="11" fontFamily="var(--font-mono)" fontWeight="500" textAnchor="middle"
                  >
                    {line3}
                  </text>
                  {/* 점 — 레이블보다 위 레이어에 그려짐 */}
                  <circle cx={cx} cy={cy} r={isHov ? 6 : 4} fill={dotColor} />
                </g>
              );
            })}

            {/* 7. 접선 */}
            {tangentPoints && (
              <polyline points={tangentPoints} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" />
            )}

            {/* 8. 접점 */}
            {tangentX !== null && tangentY !== null && isFinite(tangentY) && (
              <circle cx={toX(tangentX)} cy={toY(tangentY)} r="4" fill="var(--color-accent)" />
            )}

            {/* 9. x값 조회 강조점 (최상단) */}
            {queryResult && isFinite(queryResult.yNum) && (
              <>
                <line
                  x1={toX(queryResult.xNum)} y1={toY(queryResult.yNum)}
                  x2={toX(queryResult.xNum)} y2={toY(0)}
                  stroke={COLORS.queryLine} strokeWidth="1" strokeDasharray="4 4"
                />
                <circle cx={toX(queryResult.xNum)} cy={toY(queryResult.yNum)} r="5" fill="var(--color-accent)" />
                <text
                  x={toX(queryResult.xNum)} y={toY(queryResult.yNum) - 12}
                  fill={COLORS.queryLabel} fontSize="14" fontFamily="var(--font-mono)" textAnchor="middle"
                >
                  ({formatNum(queryResult.xNum)}, {queryResult.y})
                </text>
              </>
            )}
          </>
        )}
      </svg>

      {/* 도구 */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '420px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowDerivative((v) => !v)}
          style={{
            background: showDerivative ? '#161a28' : 'none',
            border: '1px solid',
            borderColor: showDerivative ? 'var(--color-vis-deriv)' : 'var(--color-border)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: showDerivative ? 'var(--color-vis-deriv)' : 'var(--color-text-subtle)',
            padding: '5px 14px',
          }}
        >
          f′(x) {showDerivative ? '숨기기' : '보기'}
        </button>

        {tangentX !== null && tangentY !== null && isFinite(tangentY) && tangentSlope !== null && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            <div>
              접점&nbsp;
              <span style={{ color: 'var(--color-text)' }}>
                ({tangentX.toFixed(2)}, {formatNum(tangentY)})
              </span>
            </div>
            <div>
              기울기&nbsp;
              <span style={{ color: 'var(--color-accent)' }}>{tangentSlope.toFixed(4)}</span>
            </div>
            <div>
              y&nbsp;=&nbsp;
              <span style={{ color: 'var(--color-accent)' }}>{tangentSlope.toFixed(2)}</span>
              (x&nbsp;&minus;&nbsp;{tangentX.toFixed(2)})&nbsp;+&nbsp;{formatNum(tangentY)}
            </div>
          </div>
        )}

        {tangentX !== null && (
          <button
            onClick={() => setTangentX(null)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              padding: '5px 12px',
            }}
          >
            접선 지우기
          </button>
        )}

        {/* x값 조회 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>x =</span>
          <input
            type="number"
            step="any"
            value={queryX}
            onChange={(e) => setQueryX(e.target.value)}
            placeholder="값"
            style={{
              width: '72px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* x값 조회 결과 */}
      {queryResult && (
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '8px 16px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '420px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}>
          <span style={{ color: 'var(--color-text-muted)' }}>
            f(<span style={{ color: 'var(--color-text)' }}>{queryX}</span>)
            {' = '}
            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{queryResult.y}</span>
          </span>
          {showDerivative && (
            <span style={{ color: 'var(--color-text-muted)' }}>
              f′(<span style={{ color: 'var(--color-text)' }}>{queryX}</span>)
              {' = '}
              <span style={{ color: 'var(--color-vis-deriv)', fontWeight: 600 }}>{queryResult.dy}</span>
            </span>
          )}
        </div>
      )}

      {/* 극대/극소 목록 패널 */}
      {criticalPoints.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
          {criticalPoints.map((p, i) => {
            const isMax = p.type === 'max';
            return (
              <button
                key={i}
                onClick={() => setQueryX(String(Math.round(p.x * 1e6) / 1e6))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  border: `1px solid ${isMax ? COLORS.critMaxBtnBdr : COLORS.critMinBtnBdr}`,
                  background: isMax ? COLORS.critMaxBtnBg : COLORS.critMinBtnBg,
                  color: isMax ? COLORS.critMax : COLORS.critMin,
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    isMax ? COLORS.critMaxBtnHov : COLORS.critMinBtnHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    isMax ? COLORS.critMaxBtnBg : COLORS.critMinBtnBg;
                }}
              >
                <span>{isMax ? '극대' : '극소'}</span>
                <span style={{ color: COLORS.btnSecText }}>
                  x = {formatCriticalLabel(p.x)},&nbsp;y = {formatCriticalLabel(p.y)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-ghost)', margin: 0 }}>
        그래프를 클릭하면 해당 점의 접선이 그려집니다
      </p>
    </div>
  );
}

/** 소수점 4자리, 불필요한 0 제거 */
function formatNum(n: number): string {
  if (Math.abs(n) < 1e-10) return '0';
  return parseFloat(n.toFixed(4)).toString();
}

/** 루트 레이블: 정수 근이면 정확값, 아니면 ≈ 소수 2자리 */
function formatRootLabel(root: number): string {
  const rounded = Math.round(root);
  if (Math.abs(root - rounded) < 1e-6) return `x = ${rounded}`;
  return `x ≈ ${root.toFixed(2)}`;
}

/** 순수 표시용 — mathjs 평가 없이 raw 입력을 LaTeX으로 변환 */
function LatexPreview({ raw }: { raw: string }) {
  const latex = useMemo(() => {
    try {
      let s = raw.trim();
      s = s.replace(/\^(\d+)/g, '^{$1}');
      s = s.replace(/\*/g, ' \\cdot ');
      s = s.replace(/\bsqrt\b/g, '\\sqrt');
      s = s.replace(/\bpi\b/g, '\\pi');
      s = s.replace(/\bsin\b/g, '\\sin');
      s = s.replace(/\bcos\b/g, '\\cos');
      s = s.replace(/\btan\b/g, '\\tan');
      s = s.replace(/\blog\b/g, '\\log');
      s = s.replace(/\bexp\b/g, '\\exp');
      s = s.replace(/\babs\b/g, '\\left|');
      return `f(x) = ${s}`;
    } catch {
      return `f(x) = ${raw}`;
    }
  }, [raw]);

  try {
    return <InlineMath math={latex} />;
  } catch {
    return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>{raw}</span>;
  }
}
