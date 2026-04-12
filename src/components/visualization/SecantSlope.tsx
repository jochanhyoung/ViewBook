'use client';
import { useState, useCallback } from 'react';
import { safeEval } from '@/lib/safe-math';

interface SecantSlopeProps {
  fn: string;
  a: number;
}

const H_PRESETS = [2, 1, 0.5, 0.1, 0.01] as const;
const H_MIN = 0.001;
const H_MAX = 3;

export function SecantSlope({ fn, a }: SecantSlopeProps) {
  const [h, setH] = useState(1);

  const evalFn = useCallback(
    (x: number) => { try { return safeEval(fn, { x }); } catch { return 0; } },
    [fn]
  );

  const fa = evalFn(a);
  const fb = evalFn(a + h);
  const slope = (fb - fa) / h;
  const trueSlope = (evalFn(a + 0.0001) - fa) / 0.0001;

  const W = 420, H_SVG = 260;
  const xPad = 1.8;
  const xMin = a - xPad * 1.5;
  const xMax = a + h + xPad;

  const ys: number[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = xMin + (i / 60) * (xMax - xMin);
    const y = evalFn(x);
    if (isFinite(y)) ys.push(y);
  }
  const yCenter = (fa + fb) / 2;
  const ySpan = Math.max(Math.abs(fb - fa) * 1.8, 4);
  const yMin = yCenter - ySpan / 2;
  const yMax = yCenter + ySpan / 2;

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number) { return H_SVG - ((y - yMin) / (yMax - yMin)) * H_SVG; }

  const curvePts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    const y = evalFn(x);
    if (isFinite(y)) curvePts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
  }

  // Secant line endpoints
  const secSlope = slope;
  const secY1 = fa + secSlope * (xMin - a);
  const secY2 = fa + secSlope * (xMax - a);

  // Tangent line at a
  const tangY1 = fa + trueSlope * (xMin - a);
  const tangY2 = fa + trueSlope * (xMax - a);

  const ax = toX(a), ay = toY(fa);
  const bx = toX(a + h), by = toY(fb);

  const hOpacity = Math.min(1, Math.max(0, 1 - Math.abs(h) * 0.3));

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '14px',
      overflowY: 'auto',
    }}>
      {/* SVG graph */}
      <svg width={W} height={H_SVG} style={{ overflow: 'visible', flexShrink: 0 }}>
        {/* Tangent (limit) — fades in as h→0 */}
        <line
          x1={toX(xMin)} y1={toY(tangY1)}
          x2={toX(xMax)} y2={toY(tangY2)}
          stroke="#d4ff4f" strokeWidth="1" strokeDasharray="5 4"
          strokeOpacity={Math.max(0, 1 - Math.abs(h) * 2.5)}
        />

        {/* Secant line */}
        <line
          x1={toX(xMin)} y1={toY(secY1)}
          x2={toX(xMax)} y2={toY(secY2)}
          stroke="#8aa82d" strokeWidth="1.8" strokeOpacity="0.9"
        />

        {/* Δx / Δy right-angle helper — visible when h is large enough */}
        {Math.abs(h) > 0.08 && (() => {
          const op = Math.min(1, (Math.abs(h) - 0.08) / 0.2);
          return (
            <g opacity={op}>
              <line x1={ax} y1={ay} x2={bx} y2={ay}
                stroke="rgba(212,255,79,0.35)" strokeWidth="1" strokeDasharray="4 3" />
              <line x1={bx} y1={ay} x2={bx} y2={by}
                stroke="rgba(138,168,45,0.35)" strokeWidth="1" strokeDasharray="4 3" />
              <text x={(ax + bx) / 2} y={ay + 14}
                fill="rgba(212,255,79,0.6)" fontSize="10" textAnchor="middle"
                fontFamily="JetBrains Mono, monospace">Δx = h</text>
              <text x={bx + 7} y={(ay + by) / 2}
                fill="rgba(138,168,45,0.8)" fontSize="10" textAnchor="start"
                fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">Δy</text>
            </g>
          );
        })()}

        {/* Curve */}
        <polyline points={curvePts.join(' ')} fill="none" stroke="#ececef" strokeWidth="2" />

        {/* Point A */}
        <circle cx={ax} cy={ay} r="5" fill="#d4ff4f" />
        <text x={ax - 6} y={ay - 12}
          fill="#d4ff4f" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          A
        </text>

        {/* Point B */}
        <circle cx={bx} cy={by} r="4" fill="#8aa82d" />
        <text x={bx + 6} y={by - 10}
          fill="#8aa82d" fontSize="11" textAnchor="start" fontFamily="JetBrains Mono, monospace">
          B
        </text>

        {/* h bracket */}
        <line x1={ax} y1={ay + 24} x2={bx} y2={ay + 24} stroke="#26262d" strokeWidth="1" />
        <line x1={ax} y1={ay + 20} x2={ax} y2={ay + 28} stroke="#26262d" strokeWidth="1" />
        <line x1={bx} y1={ay + 20} x2={bx} y2={ay + 28} stroke="#26262d" strokeWidth="1" />
        <text x={(ax + bx) / 2} y={ay + 38}
          fill="#3a3a44" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          h = {h < 0.01 ? h.toPrecision(3) : Number.isInteger(h) ? h : h.toPrecision(3)}
        </text>
      </svg>

      {/* h presets + slider */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#5a5a66', flexShrink: 0, letterSpacing: '0.1em' }}>
            h =
          </span>
          {H_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setH(p)}
              style={{
                flex: 1,
                background: h === p ? 'rgba(212,255,79,0.12)' : 'none',
                border: '1px solid',
                borderColor: h === p ? '#d4ff4f' : '#26262d',
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: h === p ? '#d4ff4f' : '#8a8a96',
                padding: '4px 0',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={Math.log10(H_MIN)}
          max={Math.log10(H_MAX)}
          step={0.005}
          value={Math.log10(Math.abs(h) || H_MIN)}
          onChange={(e) => {
            const v = parseFloat(Math.pow(10, Number(e.target.value)).toPrecision(3));
            setH(v);
          }}
          style={{ width: '100%', accentColor: '#d4ff4f' }}
        />
      </div>

      {/* Info panel */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#111114',
        border: '1px solid #1e1e25',
        borderRadius: '8px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Coordinates */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66' }}>
            A = <span style={{ color: '#d4ff4f' }}>({a}, {fa.toFixed(3)})</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66' }}>
            B = <span style={{ color: '#8aa82d' }}>({(a + h).toPrecision(3)}, {fb.toFixed(3)})</span>
          </div>
        </div>

        {/* Slope formula */}
        <div style={{ borderTop: '1px solid #1e1e25', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#5a5a66' }}>
            할선 기울기 = Δy / Δx
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: '#d4ff4f', fontWeight: 'bold' }}>
            {slope.toFixed(5)}
          </span>
        </div>

        {/* Limit guide */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a44' }}>
            h → 0 이면 →
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8aa82d' }}>
            f′({a}) ≈ {trueSlope.toFixed(5)}
          </span>
        </div>
      </div>
    </div>
  );
}
