'use client';
import { useState } from 'react';

interface ClockAngleProps {
  hour: number;
  minute: number;
  interactive?: boolean;
}

export function ClockAngle({ hour, minute, interactive = true }: ClockAngleProps) {
  const [currentMinute, setCurrentMinute] = useState(hour * 60 + minute);

  const normalizedHour = Math.floor(currentMinute / 60) % 12;
  const minutes = currentMinute % 60;
  const hourAngle = normalizedHour * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const angleDiff = Math.abs(hourAngle - minuteAngle);
  const smallAngle = Math.min(angleDiff, 360 - angleDiff);

  function polar(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: 140 + radius * Math.cos(rad),
      y: 140 + radius * Math.sin(rad),
    };
  }

  const hourHand = polar(hourAngle, 52);
  const minuteHand = polar(minuteAngle, 82);
  const currentHour = Math.floor(currentMinute / 60) % 12 || 12;

  function updateTime(nextHour: number, nextMinute: number) {
    const safeHour = Math.min(12, Math.max(1, nextHour));
    const safeMinute = Math.min(59, Math.max(0, nextMinute));
    setCurrentMinute((safeHour % 12) * 60 + safeMinute);
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div className="aspect-square w-full max-w-[280px] sm:max-w-[320px]">
      <svg width="280" height="280" viewBox="0 0 280 280" className="h-full w-full" style={{ flexShrink: 0 }}>
        <circle cx="140" cy="140" r="104" fill="var(--color-bg-elevated)" stroke="var(--color-border)" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = index * 30;
          const outer = polar(angle, 96);
          const inner = polar(angle, 84);
          const label = polar(angle, 70);
          return (
            <g key={index}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="var(--color-text-muted)" strokeWidth="2" />
              <text x={label.x} y={label.y + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--color-text-subtle)">
                {index === 0 ? 12 : index}
              </text>
            </g>
          );
        })}
        <path
          d={`M 140 140 L ${polar(Math.min(hourAngle, minuteAngle), 32).x} ${polar(Math.min(hourAngle, minuteAngle), 32).y} A 32 32 0 ${smallAngle > 180 ? 1 : 0} 1 ${polar(Math.max(hourAngle, minuteAngle), 32).x} ${polar(Math.max(hourAngle, minuteAngle), 32).y} Z`}
          fill="var(--color-accent-bg)"
          opacity="0.75"
        />
        <line x1="140" y1="140" x2={hourHand.x} y2={hourHand.y} stroke="var(--color-text)" strokeWidth="5" strokeLinecap="round" />
        <line x1="140" y1="140" x2={minuteHand.x} y2={minuteHand.y} stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="140" r="5" fill="var(--color-accent)" />
      </svg>
      </div>

      <div className="flex w-full max-w-[420px] flex-col gap-2.5">
        <div className="flex flex-col gap-2 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          <span>{interactive ? '시간 슬라이더' : '문제 시각'}</span>
          {interactive ? (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <NumericInput label="시" value={currentHour} min={1} max={12} onChange={(value) => updateTime(value, minutes)} />
              <NumericInput label="분" value={minutes} min={0} max={59} onChange={(value) => updateTime(currentHour, value)} />
            </div>
          ) : (
            <span>{String(normalizedHour === 0 ? 12 : normalizedHour).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</span>
          )}
        </div>
        {interactive ? (
          <input
            type="range"
            min={0}
            max={719}
            step={1}
            value={currentMinute}
            onChange={(e) => setCurrentMinute(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
        ) : (
          <div style={{ height: '1px', background: 'var(--color-bg-surface)', width: '100%' }} />
        )}
      </div>

      <div className="grid w-full max-w-[420px] grid-cols-1 gap-2.5 sm:grid-cols-2" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px' }}>
        <Stat label="시침 각도" value={`${hourAngle.toFixed(1)}°`} />
        <Stat label="분침 각도" value={`${minuteAngle.toFixed(1)}°`} />
        <Stat label="작은 각" value={`${smallAngle.toFixed(1)}°`} />
        <Stat label="큰 각" value={`${(360 - smallAngle).toFixed(1)}°`} />
      </div>
    </div>
  );
}

function NumericInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-14 sm:w-16"
        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}
