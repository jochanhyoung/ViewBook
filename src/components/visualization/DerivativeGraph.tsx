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

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (W / rect.width);
    const x = xMin + (svgX / W) * (xMax - xMin);
    setCursor(Math.max(xMin, Math.min(xMax, x)));
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-3 overflow-y-auto p-4 sm:p-[18px]">
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        <div className="aspect-[380/130] w-full">
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={handleMouseMove}
        className="h-full w-full"
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {/* 라벨 — SVG 내부 좌표로 고정, 컨테이너 너비와 무관 */}
        <text x={4} y={14} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1" fill="var(--color-text-muted)">
          f(x) — 원함수
        </text>
        {yMin <= 0 && yMax >= 0 && (
          <line x1={0} y1={toY(0, yMin, yMax)} x2={W} y2={toY(0, yMin, yMax)} stroke="var(--color-border)" strokeWidth="1" />
        )}
        <polyline points={fPoints} fill="none" stroke="var(--color-text)" strokeWidth="2" />
        {/* 접선 */}
        <line
          x1={toX(xMin)} y1={toY(evalFn(cursor) + slope * (xMin - cursor), yMin, yMax)}
          x2={toX(xMax)} y2={toY(evalFn(cursor) + slope * (xMax - cursor), yMin, yMax)}
          stroke="var(--color-accent)" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 3"
        />
        {/* 수직선 */}
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="var(--color-text-ghost)" strokeWidth="1" strokeDasharray="2 2" />
        {/* 접점 */}
        <circle cx={cx} cy={cy_f} r="4" fill="var(--color-accent)" />
      </svg>
        </div>

        <div className="aspect-[380/130] w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={handleMouseMove}
        className="h-full w-full"
        style={{ cursor: 'crosshair', overflow: 'visible' }}
      >
        {/* 라벨 — SVG 내부 좌표로 고정 */}
        <text x={4} y={14} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1" fill="var(--color-text-muted)">
          f′(x) — 도함수
        </text>
        {dMin <= 0 && dMax >= 0 && (
          <line x1={0} y1={toY(0, dMin, dMax)} x2={W} y2={toY(0, dMin, dMax)} stroke="var(--color-border)" strokeWidth="1" />
        )}
        <polyline points={dPoints} fill="none" stroke="var(--color-accent-dim)" strokeWidth="2" />
        <line x1={cx} y1={0} x2={cx} y2={H} stroke="var(--color-text-ghost)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={cx} cy={cy_d} r="4" fill="var(--color-accent-dim)" />
      </svg>
        </div>

      {/* 수치 표시 */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-md px-3 py-2"
        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          x = {cursor.toFixed(3)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text)' }}>
          f(x) = {evalFn(cursor).toFixed(3)}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent)' }}>
          f′(x) = {slope.toFixed(3)}
        </span>
      </div>
      </div>
    </div>
  );
}
