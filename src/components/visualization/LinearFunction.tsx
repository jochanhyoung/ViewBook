'use client';
import { useMemo, useState } from 'react';

interface LinearFunctionProps {
  slope: number;
  intercept: number;
  interactive?: boolean;
}

export function LinearFunction({ slope, intercept, interactive = true }: LinearFunctionProps) {
  const [m, setM] = useState(slope);
  const [b, setB] = useState(intercept);

  const points = useMemo(() => {
    const items: string[] = [];
    for (let x = -6; x <= 6; x += 0.2) {
      const y = m * x + b;
      const svgX = 190 + x * 24;
      const svgY = 125 - y * 18;
      items.push(`${svgX},${svgY}`);
    }
    return items.join(' ');
  }, [m, b]);

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div className="aspect-[380/250] w-full max-w-[420px]">
      <svg width="380" height="250" viewBox="0 0 380 250" className="h-full w-full" style={{ flexShrink: 0 }}>
        <line x1="20" y1="125" x2="360" y2="125" stroke="var(--color-border)" />
        <line x1="190" y1="20" x2="190" y2="230" stroke="var(--color-border)" />
        <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx={190} cy={125 - b * 18} r="5" fill="var(--color-accent-dim)" />
      </svg>
      </div>

      <div className="flex w-full max-w-[420px] flex-col gap-2.5">
        {interactive ? (
          <>
            <Slider label="m" value={m} min={-5} max={5} step={0.1} onChange={setM} />
            <Slider label="b" value={b} min={-8} max={8} step={0.1} onChange={setB} />
          </>
        ) : (
          <>
            <FixedRow label="m" value={m.toFixed(1)} />
            <FixedRow label="b" value={b.toFixed(1)} />
          </>
        )}
      </div>

      <div className="w-full max-w-[420px]" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>식</div>
        <div className="text-sm sm:text-base" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>y = {m.toFixed(1)}x {b >= 0 ? '+' : '-'} {Math.abs(b).toFixed(1)}</div>
      </div>
    </div>
  );
}

function FixedRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', paddingBottom: '6px', borderBottom: '1px solid var(--color-bg-surface)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ValueInput({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (next: number) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        style={{ width: '68px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
      />
    </label>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (next: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
        <span>{label} 슬라이더</span>
        <ValueInput label={label} value={value} min={min} max={max} step={step} onChange={onChange} />
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
    </div>
  );
}
