'use client';
import { useState, useCallback, useRef } from 'react';
import { safeEval } from '@/lib/safe-math';

interface DerivativeGraphProps {
  fnLatex: string;
  fn: string;
  domain: [number, number];
}

export function DerivativeGraph({ fn, domain }: DerivativeGraphProps) {
  const [cursor, setCursor] = useState((domain[0] + domain[1]) / 2);
  const svgRef = useRef<SVGSVGElement>(null);

  const evalFn = useCallback(
    (x: number) => {
      try { return safeEval(fn, { x }); } catch { return 0; }
    },
    [fn]
  );

  const evalDeriv = useCallback(
    (x: number) => {
      const h = 0.0001;
      return (evalFn(x + h) - evalFn(x - h)) / (2 * h);
    },
    [evalFn]
  );

  const W = 380, H = 130;
  const [xMin, xMax] = domain;

  // 값 범위 계산
  const yVals = Array.from({ length: 100 }, (_, i) => evalFn(xMin + (i / 99) * (xMax - xMin)));
  const dVals = Array.from({ length: 100 }, (_, i) => evalDeriv(xMin + (i / 99) * (xMax - xMin)));
  const yMin = Math.min(...yVals) - 0.5, yMax = Math.max(...yVals) + 0.5;
  const dMin = Math.min(...dVals) - 0.5, dMax = Math.max(...dVals) + 0.5;

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number, min: number, max: number) { return H - ((y - min) / (max - min)) * H; }

  const fPoints = Array.from({ length: 100 }, (_, i) => {
    const x = xMin + (i / 99) * (xMax - xMin);
    return `${toX(x)},${toY(evalFn(x), yMin, yMax)}`;
  }).join(' ');

  const dPoints = Array.from({ length: 100 }, (_, i) => {
    const x = xMin + (i / 99) * (xMax - xMin);
    return `${toX(x)},${toY(evalDeriv(x), dMin, dMax)}`;
  }).join(' ');

  const cx = toX(cursor);
  const cy_f = toY(evalFn(cursor), yMin, yMax);
  const cy_d = toY(evalDeriv(cursor), dMin, dMax);
  const slope = evalDeriv(cursor);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>, which: 'top' | 'bottom') {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (W / rect.width);
    const x = xMin + (svgX / W) * (xMax - xMin);
    setCursor(Math.max(xMin, Math.min(xMax, x)));
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '8px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#5a5a66', letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
        f(x) — 원함수
      </p>
      <svg
        ref={svgRef}
        width={W}
        height={H}
        onMouseMove={(e) => handleMouseMove(e, 'top')}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {/* x축 */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={0} y1={toY(0, yMin, yMax)} x2={W} y2={toY(0, yMin, yMax)} stroke="#26262d" strokeWidth="1" />
        )}
        <polyline points={fPoints} fill="none" stroke="#ececef" strokeWidth="2" />
        {/* 접선 */}
        <line
          x1={toX(xMin)} y1={toY(evalFn(cursor) + slope * (xMin - cursor), yMin, yMax)}
          x2={toX(xMax)} y2={toY(evalFn(cursor) + slope * (xMax - cursor), yMin, yMax)}
          stroke="#d4ff4f" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 3"
        />
        {/* 수직선 */}
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#3a3a44" strokeWidth="1" strokeDasharray="2 2" />
        {/* 접점 */}
        <circle cx={cx} cy={cy_f} r="4" fill="#d4ff4f" />
      </svg>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#5a5a66', letterSpacing: '0.1em', alignSelf: 'flex-start', marginTop: '8px' }}>
        f′(x) — 도함수
      </p>
      <svg
        width={W}
        height={H}
        onMouseMove={(e) => handleMouseMove(e, 'bottom')}
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {dMin <= 0 && dMax >= 0 && (
          <line x1={0} y1={toY(0, dMin, dMax)} x2={W} y2={toY(0, dMin, dMax)} stroke="#26262d" strokeWidth="1" />
        )}
        <polyline points={dPoints} fill="none" stroke="#8aa82d" strokeWidth="2" />
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#3a3a44" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={cx} cy={cy_d} r="4" fill="#8aa82d" />
      </svg>

      {/* 수치 표시 */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66' }}>
          x = {cursor.toFixed(3)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ececef' }}>
          f(x) = {evalFn(cursor).toFixed(3)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#d4ff4f' }}>
          f′(x) = {slope.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
