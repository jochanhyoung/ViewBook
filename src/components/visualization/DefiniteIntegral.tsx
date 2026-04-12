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
          fill="rgba(138, 168, 45, 0.2)"
          stroke="none"
        />

        {/* x축 */}
        <line x1={0} y1={toY(0)} x2={W} y2={toY(0)} stroke="#3a3a44" strokeWidth="1" />

        {/* 경계선 */}
        <line x1={toX(a)} y1={0} x2={toX(a)} y2={H} stroke="#5a5a66" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={toX(b)} y1={0} x2={toX(b)} y2={H} stroke="#5a5a66" strokeWidth="1" strokeDasharray="3 3" />

        {/* 라벨 */}
        <text x={toX(a)} y={H + 16} fill="#5a5a66" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">a={a}</text>
        <text x={toX(b)} y={H + 16} fill="#5a5a66" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">b={b}</text>

        {/* 적분값 표시 */}
        <text
          x={(toX(a) + toX(b)) / 2}
          y={toY((Math.max(...yVals) + yMax) / 2)}
          fill="#8aa82d"
          fontSize="13"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
        >
          {integral.toFixed(4)}
        </text>

        {/* 곡선 */}
        <polyline points={curvePoints} fill="none" stroke="#ececef" strokeWidth="2.5" />
      </svg>

      {/* 결과 */}
      <div style={{ background: '#1a1a1f', border: '1px solid #26262d', borderRadius: '6px', padding: '14px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#5a5a66', marginBottom: '6px', letterSpacing: '0.1em' }}>
          ∫ₐᵇ f(x) dx
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: '#d4ff4f', margin: 0 }}>
          ≈ {integral.toFixed(6)}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a44', marginTop: '4px' }}>
          (수치 적분, 심프슨 법칙)
        </p>
      </div>
    </div>
  );
}
