'use client';
import { useCallback } from 'react';
import { safeEval } from '@/lib/safe-math';

interface DefiniteIntegralProps {
  fn: string;
  a: number;
  b: number;
}

export function DefiniteIntegral({ fn, a, b }: DefiniteIntegralProps) {
  const evalFn = useCallback(
    (x: number) => {
      try { return safeEval(fn, { x }); } catch { return 0; }
    },
    [fn]
  );

  // 수치 적분 (심프슨 법칙)
  const N = 1000;
  const dx = (b - a) / N;
  let integral = 0;
  for (let i = 0; i <= N; i++) {
    const x = a + i * dx;
    const w = i === 0 || i === N ? 1 : i % 2 === 0 ? 2 : 4;
    integral += w * evalFn(x);
  }
  integral *= dx / 3;

  const W = 380, H = 260;
  const yVals = Array.from({ length: 100 }, (_, i) => evalFn(a + (i / 99) * (b - a)));
  const xPad = (b - a) * 0.15;
  const xMin = a - xPad, xMax = b + xPad;
  const yMin = Math.min(0, ...yVals) - 0.4;
  const yMax = Math.max(0, ...yVals) + 0.6;

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number) { return H - ((y - yMin) / (yMax - yMin)) * H; }

  const curvePoints = Array.from({ length: 200 }, (_, i) => {
    const x = xMin + (i / 199) * (xMax - xMin);
    return `${toX(x)},${toY(evalFn(x))}`;
  }).join(' ');

  // 채워진 영역 (polygon)
  const fillPoints: string[] = [];
  fillPoints.push(`${toX(a)},${toY(0)}`);
  for (let i = 0; i <= 100; i++) {
    const x = a + (i / 100) * (b - a);
    fillPoints.push(`${toX(x)},${toY(evalFn(x))}`);
  }
  fillPoints.push(`${toX(b)},${toY(0)}`);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '20px' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {/* 채워진 영역 */}
        <polygon
          points={fillPoints.join(' ')}
          fill="var(--color-vis-rect-pos)"
          stroke="none"
        />
        {/* x축 */}
        <line x1={0} y1={toY(0)} x2={W} y2={toY(0)} stroke="var(--color-text-ghost)" strokeWidth="1" />
        {/* 경계선 */}
        <line x1={toX(a)} y1={0} x2={toX(a)} y2={H} stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={toX(b)} y1={0} x2={toX(b)} y2={H} stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="3 3" />
        {/* 라벨 */}
        <text x={toX(a)} y={H + 16} fill="var(--color-text-muted)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">a={a}</text>
        <text x={toX(b)} y={H + 16} fill="var(--color-text-muted)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">b={b}</text>
        {/* 적분값 표시 */}
        <text
          x={(toX(a) + toX(b)) / 2}
          y={toY((Math.max(...yVals) + yMax) / 2)}
          fill="var(--color-accent-dim)"
          fontSize="13"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
        >
          {integral.toFixed(4)}
        </text>
        {/* 곡선 */}
        <polyline points={curvePoints} fill="none" stroke="var(--color-text)" strokeWidth="2.5" />
      </svg>

      {/* 결과 */}
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '14px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '6px', letterSpacing: '0.1em' }}>
          ∫ₐᵇ f(x) dx
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--color-accent)', margin: 0 }}>
          ≈ {integral.toFixed(6)}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)', marginTop: '4px' }}>
          (수치 적분, 심프슨 법칙)
        </p>
      </div>
    </div>
  );
}
