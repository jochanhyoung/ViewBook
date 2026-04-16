'use client';
import { useMemo, useState } from 'react';

interface QuadraticFunctionProps {
  a: number;
  interactive?: boolean;
}

export function QuadraticFunction({ a, interactive = true }: QuadraticFunctionProps) {
  const [coefficient, setCoefficient] = useState(a);

  const points = useMemo(() => {
    const items: string[] = [];
    for (let x = -4; x <= 4; x += 0.08) {
      const y = coefficient * x * x;
      const svgX = 190 + x * 36;
      const svgY = 190 - y * 18;
      items.push(`${svgX},${svgY}`);
    }
    return items.join(' ');
  }, [coefficient]);

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div className="aspect-[380/250] w-full max-w-[420px]">
      <svg width="380" height="250" viewBox="0 0 380 250" className="h-full w-full" style={{ flexShrink: 0 }}>
        <line x1="20" y1="190" x2="360" y2="190" stroke="var(--color-border)" />
        <line x1="190" y1="20" x2="190" y2="230" stroke="var(--color-border)" />
        <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx="190" cy="190" r="5" fill="var(--color-accent-dim)" />
      </svg>
      </div>

      <div className="flex w-full max-w-[420px] flex-col gap-2">
        <div className="flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          <span>{interactive ? 'a 값 슬라이더' : '문제 계수'}</span>
          {interactive ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
              <span>a</span>
              <input
                type="number"
                min={-3}
                max={3}
                step={0.1}
                value={coefficient}
                onChange={(e) => setCoefficient(Math.min(3, Math.max(-3, Number(e.target.value) || 0)))}
                style={{ width: '68px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
              />
            </label>
          ) : (
            <span>{coefficient.toFixed(1)}</span>
          )}
        </div>
        {interactive ? (
          <input type="range" min={-3} max={3} step={0.1} value={coefficient} onChange={(e) => setCoefficient(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
        ) : (
          <div style={{ height: '1px', background: 'var(--color-bg-surface)', width: '100%' }} />
        )}
      </div>

      <div className="grid w-full max-w-[420px] grid-cols-1 gap-2.5 sm:grid-cols-2" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px' }}>
        <Stat label="식" value={`y = ${coefficient.toFixed(1)}x^2`} />
        <Stat label="방향" value={coefficient >= 0 ? '위로 열림' : '아래로 열림'} />
        <Stat label="꼭짓점" value="(0, 0)" />
        <Stat label="폭" value={Math.abs(coefficient) > 1 ? '더 좁아짐' : '더 넓어짐'} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}
