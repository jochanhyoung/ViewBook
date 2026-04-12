'use client';
import { useState, useCallback } from 'react';
import { safeEval } from '@/lib/safe-math';

interface RiemannSumProps {
  fn: string;
  a: number;
  b: number;
  n: number;
  method: 'left' | 'right' | 'midpoint';
}

const N_STEPS = [4, 8, 16, 32, 64, 128];

export function RiemannSum({ fn, a, b, n: initN, method: initMethod }: RiemannSumProps) {
  const initIdx = N_STEPS.reduce((best, val, i) =>
    Math.abs(val - initN) < Math.abs(N_STEPS[best] - initN) ? i : best, 0);

  const [nIdx, setNIdx] = useState(initIdx);
  const [method, setMethod] = useState<'left' | 'right' | 'midpoint'>(initMethod);
  const n = N_STEPS[nIdx];

  const evalFn = useCallback(
    (x: number) => { try { return safeEval(fn, { x }); } catch { return 0; } },
    [fn]
  );

  const dx = (b - a) / n;
  let riemannSum = 0;
  const rects: { x: number; y: number; h: number }[] = [];

  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const xRep = method === 'left' ? x0 : method === 'right' ? x0 + dx : x0 + dx / 2;
    const fVal = evalFn(xRep);
    riemannSum += fVal * dx;
    rects.push({ x: x0, y: fVal >= 0 ? 0 : fVal, h: Math.abs(fVal) });
  }

  const W = 380, H_SVG = 220;
  const yVals = Array.from({ length: 100 }, (_, i) => evalFn(a + (i / 99) * (b - a)));
  const yMin = Math.min(0, ...yVals) - 0.3;
  const yMax = Math.max(0, ...yVals) + 0.5;

  function toX(x: number) { return ((x - a) / (b - a)) * W; }
  function toY(y: number) { return H_SVG - ((y - yMin) / (yMax - yMin)) * H_SVG; }
  function toH(h: number) { return (h / (yMax - yMin)) * H_SVG; }

  const curvePoints = Array.from({ length: 200 }, (_, i) => {
    const x = a + (i / 199) * (b - a);
    return `${toX(x)},${toY(evalFn(x))}`;
  }).join(' ');

  const maxVisible = Math.min(n, 128);
  const step = Math.ceil(n / maxVisible);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '14px' }}>
      {/* 그래프 */}
      <svg width={W} height={H_SVG} style={{ overflow: 'visible' }}>
        {rects.filter((_, i) => i % step === 0).map((r, i) => (
          <rect
            key={i}
            x={toX(r.x)}
            y={toY(r.y + r.h)}
            width={Math.max(1, toX(a + dx) - toX(a))}
            height={toH(r.h)}
            fill={riemannSum >= 0 ? 'var(--color-vis-rect-pos)' : 'var(--color-vis-rect-neg)'}
            stroke="var(--color-accent-dim)" strokeWidth="0.5" strokeOpacity="0.5"
          />
        ))}
        <line x1={0} y1={toY(0)} x2={W} y2={toY(0)} stroke="var(--color-text-ghost)" strokeWidth="1" />
        <polyline points={curvePoints} fill="none" stroke="var(--color-text)" strokeWidth="2" />
      </svg>

      {/* 이산 n 버튼 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '380px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          분할 수 n
        </span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {N_STEPS.map((nVal, i) => (
            <button
              key={nVal}
              onClick={() => setNIdx(i)}
              style={{
                flex: 1,
                background: nIdx === i ? 'var(--color-accent)' : 'none',
                border: '1px solid',
                borderColor: nIdx === i ? 'var(--color-accent)' : 'var(--color-border)',
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: nIdx === i ? 'var(--color-accent-fg)' : 'var(--color-text-subtle)',
                padding: '5px 0',
              }}
            >
              {nVal}
            </button>
          ))}
        </div>
      </div>

      {/* 방법 선택 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['left', 'right', 'midpoint'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            style={{
              background: method === m ? 'var(--color-accent-bg)' : 'none',
              border: '1px solid',
              borderColor: method === m ? 'var(--color-accent)' : 'var(--color-border)',
              borderRadius: '3px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: method === m ? 'var(--color-accent)' : 'var(--color-text-subtle)',
              padding: '4px 14px',
              letterSpacing: '0.06em',
            }}
          >
            {m === 'left' ? '좌합' : m === 'right' ? '우합' : '중점'}
          </button>
        ))}
      </div>

      {/* 합계 */}
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px 24px', display: 'flex', gap: '28px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', margin: '0 0 2px' }}>R({n})</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--color-accent)', margin: 0 }}>{riemannSum.toFixed(4)}</p>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', margin: '0 0 2px' }}>Δx</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--color-text-dim)', margin: 0 }}>{dx.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
