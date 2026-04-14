'use client';
import { useMemo, useState } from 'react';

interface DistanceTimeProps {
  speed: number;
}

export function DistanceTime({ speed }: DistanceTimeProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const totalTime = 10;
  const distanceAtTen = currentSpeed * totalTime;

  const points = useMemo(() => {
    const items: string[] = [];
    for (let t = 0; t <= 10; t += 0.2) {
      const x = 30 + (t / totalTime) * 320;
      const y = 220 - ((currentSpeed * t) / Math.max(distanceAtTen, 1)) * 180;
      items.push(`${x},${y}`);
    }
    return items.join(' ');
  }, [currentSpeed, distanceAtTen]);

  const sampleTime = 6;
  const sampleDistance = currentSpeed * sampleTime;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px', padding: '20px', overflowY: 'auto' }}>
      <svg width="380" height="250" viewBox="0 0 380 250" style={{ flexShrink: 0 }}>
        <line x1="30" y1="220" x2="350" y2="220" stroke="var(--color-border)" />
        <line x1="30" y1="220" x2="30" y2="24" stroke="var(--color-border)" />
        <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <line x1="30" y1="220" x2="222" y2={220 - ((sampleDistance) / Math.max(distanceAtTen, 1)) * 180} stroke="var(--color-accent-dim)" strokeDasharray="5 4" />
        <circle cx="222" cy={220 - ((sampleDistance) / Math.max(distanceAtTen, 1)) * 180} r="5" fill="var(--color-accent)" />
        <text x="352" y="224" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">시간</text>
        <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">거리</text>
      </svg>

      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>속도 슬라이더</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
            <span>속도</span>
            <input
              type="number"
              min={10}
              max={100}
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(Math.min(100, Math.max(10, Number(e.target.value) || 10)))}
              style={{ width: '72px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
            />
            <span>km/h</span>
          </label>
        </div>
        <input type="range" min={10} max={100} step={1} value={currentSpeed} onChange={(e) => setCurrentSpeed(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Stat label="그래프 기울기" value={`${currentSpeed}`} />
        <Stat label="6시간 이동 거리" value={`${sampleDistance} km`} />
        <Stat label="10시간 이동 거리" value={`${distanceAtTen} km`} />
        <Stat label="해석" value="속력이 클수록 선이 더 가파름" />
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
