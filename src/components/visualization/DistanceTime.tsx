'use client';
import { useMemo, useState } from 'react';

interface DistanceTimeProps {
  speed: number;
  sampleTime?: number;
  interactive?: boolean;
}

export function DistanceTime({ speed, sampleTime = 6, interactive = true }: DistanceTimeProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [currentTime, setCurrentTime] = useState(sampleTime);
  const [speedInput, setSpeedInput] = useState(String(speed));
  const [timeInput, setTimeInput] = useState(String(sampleTime));
  const totalTime = 10;
  const maxSpeed = 100;
  const maxDistance = maxSpeed * totalTime;
  const displaySpeed = interactive ? currentSpeed : speed;
  const displayTime = interactive ? currentTime : sampleTime;
  const distanceAtTen = displaySpeed * totalTime;
  const markedTime = Math.min(totalTime, Math.max(0, displayTime));
  const markerX = 30 + (markedTime / totalTime) * 320;

  const points = useMemo(() => {
    const items: string[] = [];
    for (let t = 0; t <= 10; t += 0.2) {
      const x = 30 + (t / totalTime) * 320;
      const y = 220 - ((displaySpeed * t) / maxDistance) * 180;
      items.push(`${x},${y}`);
    }
    return items.join(' ');
  }, [displaySpeed, maxDistance]);

  const sampleDistance = displaySpeed * markedTime;
  const sampleY = 220 - (sampleDistance / maxDistance) * 180;
  const labelX = markerX > 260 ? markerX - 116 : markerX + 10;
  const labelY = Math.max(sampleY - 34, 22);

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div className="aspect-[380/250] w-full max-w-[420px]">
      <svg width="380" height="250" viewBox="0 0 380 250" className="h-full w-full" style={{ flexShrink: 0 }}>
        <line x1="30" y1="220" x2="350" y2="220" stroke="var(--color-border)" />
        <line x1="30" y1="220" x2="30" y2="24" stroke="var(--color-border)" />
        <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <line x1="30" y1="40" x2="350" y2="40" stroke="var(--color-bg-surface)" strokeDasharray="3 5" />
        <text x="36" y="36" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">1000km</text>
        <line x1={markerX} y1="220" x2={markerX} y2={sampleY} stroke="var(--color-accent-dim)" strokeDasharray="5 4" />
        <line x1="30" y1={sampleY} x2={markerX} y2={sampleY} stroke="var(--color-accent-dim)" strokeDasharray="5 4" />
        <circle cx={markerX} cy={sampleY} r="10" fill="var(--color-bg)" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx={markerX} cy={sampleY} r="4" fill="var(--color-accent)" />
        <rect x={labelX} y={labelY} width="106" height="25" rx="7" fill="var(--color-bg-elevated)" stroke="var(--color-accent-dim)" />
        <text x={labelX + 8} y={labelY + 16} fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text)">
          {markedTime}시간: {sampleDistance}km
        </text>
        <text x="352" y="224" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">시간</text>
        <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">거리</text>
      </svg>
      </div>

      {interactive ? (
        <div className="flex w-full max-w-[420px] flex-col gap-3">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <NumberControl
              label="속도 입력"
              value={speedInput}
              unit="km/h"
              min={10}
              max={100}
              step={1}
              onValueChange={setSpeedInput}
              onValidNumber={setCurrentSpeed}
            />
            <NumberControl
              label="시간 입력"
              value={timeInput}
              unit="시간"
              min={0}
              max={10}
              step={0.5}
              onValueChange={setTimeInput}
              onValidNumber={setCurrentTime}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            <span>속도 슬라이더</span>
            <span>{currentSpeed} km/h</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={currentSpeed}
            onChange={(e) => {
              const next = Number(e.target.value);
              setCurrentSpeed(next);
              setSpeedInput(String(next));
            }}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
        </div>
      ) : (
        <div className="flex w-full max-w-[420px] flex-col gap-1.5 sm:flex-row sm:justify-between" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>문제 조건 고정</span>
          <span>{displaySpeed}km/h × {markedTime}시간</span>
        </div>
      )}

      <div className="grid w-full max-w-[420px] grid-cols-1 gap-2.5 sm:grid-cols-2" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px' }}>
        <Stat label="그래프 기울기" value={`${displaySpeed} km/h`} />
        <Stat label={`${markedTime}시간 이동 거리`} value={`${sampleDistance} km`} />
        <Stat label="10시간 이동 거리" value={`${distanceAtTen} km`} />
        <Stat label="표시 점" value="해당 시간의 거리" />
      </div>
    </div>
  );
}

function NumberControl({ label, value, unit, min, max, step, onValueChange, onValidNumber }: { label: string; value: string; unit: string; min: number; max: number; step: number; onValueChange: (next: string) => void; onValidNumber: (next: number) => void }) {
  const handleChange = (raw: string) => {
    onValueChange(raw);
    if (raw.trim() === '') return;
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    if (next >= min && next <= max) onValidNumber(next);
  };

  const handleBlur = () => {
    const next = Number(value);
    if (!Number.isFinite(next)) {
      onValueChange(String(min));
      onValidNumber(min);
      return;
    }
    const clamped = Math.min(max, Math.max(min, next));
    onValueChange(String(clamped));
    onValidNumber(clamped);
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
      <span>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          style={{ width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 8px', borderRadius: '4px' }}
        />
        <span>{unit}</span>
      </span>
    </label>
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
