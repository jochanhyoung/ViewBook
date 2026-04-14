'use client';
import { useCallback } from 'react';
import { InlineMath } from 'react-katex';
import { safeEval } from '@/lib/safe-math';

interface TangentLineProps {
  fn: string;
  x0: number;
  domain: [number, number];
}

export function TangentLine({ fn, x0, domain }: TangentLineProps) {
  const evalFn = useCallback(
    (x: number) => {
      try { return safeEval(fn, { x }); } catch { return 0; }
    },
    [fn]
  );

  const f0 = evalFn(x0);
  const h = 0.0001;
  const slope = (evalFn(x0 + h) - evalFn(x0 - h)) / (2 * h);

  const W = 380, H = 280;
  const [xMin, xMax] = domain;
  const yVals = Array.from({ length: 100 }, (_, i) => evalFn(xMin + (i / 99) * (xMax - xMin)));
  const tangYVals = [
    f0 + slope * (xMin - x0),
    f0 + slope * (xMax - x0),
  ];
  const allYVals = [...yVals, ...tangYVals];
  const yMin = Math.min(...allYVals) - 0.5;
  const yMax = Math.max(...allYVals) + 0.5;

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number) { return H - ((y - yMin) / (yMax - yMin)) * H; }

  const curvePoints = Array.from({ length: 100 }, (_, i) => {
    const x = xMin + (i / 99) * (xMax - xMin);
    return `${toX(x)},${toY(evalFn(x))}`;
  }).join(' ');

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px', gap: '12px', overflowY: 'auto' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {/* 축 */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={0} y1={toY(0)} x2={W} y2={toY(0)} stroke="var(--color-border)" strokeWidth="1" />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={toX(0)} y1={0} x2={toX(0)} y2={H} stroke="var(--color-border)" strokeWidth="1" />
        )}
        {/* 곡선 */}
        <polyline points={curvePoints} fill="none" stroke="var(--color-text)" strokeWidth="2" />
        {/* 접선 */}
        <line
          x1={toX(xMin)} y1={toY(f0 + slope * (xMin - x0))}
          x2={toX(xMax)} y2={toY(f0 + slope * (xMax - x0))}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* 접점 */}
        <circle cx={toX(x0)} cy={toY(f0)} r="5" fill="var(--color-accent)" />
        <circle cx={toX(x0)} cy={toY(f0)} r="8" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeOpacity="0.4" />
        {/* 수직 보조선 */}
        <line x1={toX(x0)} y1={toY(f0)} x2={toX(x0)} y2={H} stroke="var(--color-text-ghost)" strokeWidth="1" strokeDasharray="3 3" />
        {/* 기울기 레이블 */}
        <text
          x={toX(xMax) - 10}
          y={toY(f0 + slope * (xMax - x0)) - 8}
          fill="var(--color-accent)"
          fontSize="14"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          기울기 = {slope.toFixed(3)}
        </text>
      </svg>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>접점</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text)' }}>
            ({x0}, {f0.toFixed(3)})
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>기울기</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-accent)' }}>
            {slope.toFixed(4)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>접선</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent-dim)' }}>
            y = {slope.toFixed(2)}(x - {x0}) + {f0.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
