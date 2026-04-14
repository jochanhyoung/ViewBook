'use client';
import { useMemo } from 'react';

interface SystemOfEquationsProps {
  line1: { slope: number; intercept: number };
  line2: { slope: number; intercept: number };
}

export function SystemOfEquations({ line1, line2 }: SystemOfEquationsProps) {
  const intersection = useMemo(() => {
    const denominator = line1.slope - line2.slope;
    if (denominator === 0) return null;
    const x = (line2.intercept - line1.intercept) / denominator;
    const y = line1.slope * x + line1.intercept;
    return { x, y };
  }, [line1, line2]);

  function linePoints(slope: number, intercept: number) {
    const pts: string[] = [];
    for (let x = -6; x <= 6; x += 0.2) {
      const y = slope * x + intercept;
      pts.push(`${190 + x * 24},${125 - y * 18}`);
    }
    return pts.join(' ');
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px', padding: '20px', overflowY: 'auto' }}>
      <svg width="380" height="250" viewBox="0 0 380 250" style={{ flexShrink: 0 }}>
        <line x1="20" y1="125" x2="360" y2="125" stroke="var(--color-border)" />
        <line x1="190" y1="20" x2="190" y2="230" stroke="var(--color-border)" />
        <polyline points={linePoints(line1.slope, line1.intercept)} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <polyline points={linePoints(line2.slope, line2.intercept)} fill="none" stroke="var(--color-accent-dim)" strokeWidth="3" />
        {intersection && (
          <>
            <circle cx={190 + intersection.x * 24} cy={125 - intersection.y * 18} r="6" fill="var(--color-text)" />
            <text x={198 + intersection.x * 24} y={119 - intersection.y * 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-text)">
              ({intersection.x.toFixed(1)}, {intersection.y.toFixed(1)})
            </text>
          </>
        )}
      </svg>

      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Stat label="직선 1" value={`y=${line1.slope}x${line1.intercept >= 0 ? '+' : ''}${line1.intercept}`} />
        <Stat label="직선 2" value={`y=${line2.slope}x${line2.intercept >= 0 ? '+' : ''}${line2.intercept}`} />
        <Stat label="해" value={intersection ? `(${intersection.x.toFixed(1)}, ${intersection.y.toFixed(1)})` : '없음 또는 무수히 많음'} />
        <Stat label="해석" value="교점이 연립방정식의 해" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}
