'use client';
import { useState } from 'react';

interface SaltConcentrationProps {
  water: number;
  salt: number;
  interactive?: boolean;
}

export function SaltConcentration({ water, salt, interactive = true }: SaltConcentrationProps) {
  const [waterAmount, setWaterAmount] = useState(water);
  const [saltAmount, setSaltAmount] = useState(salt);

  const total = waterAmount + saltAmount;
  const concentration = total === 0 ? 0 : (saltAmount / total) * 100;
  const fillHeight = Math.min(100, Math.max(0, total * 3.5));
  const saltRatio = total === 0 ? 0 : saltAmount / total;
  const waterRatio = total === 0 ? 1 : waterAmount / total;
  const liquidGradient = `linear-gradient(180deg,
    rgba(255,255,255,${0.95 - saltRatio * 0.25}) 0%,
    rgba(255,255,255,${0.82 - saltRatio * 0.18}) ${Math.max(18, waterRatio * 100)}%,
    rgba(168, 239, 193, ${0.35 + saltRatio * 0.25}) ${Math.max(18, waterRatio * 100)}%,
    rgba(52, 168, 83, ${0.65 + saltRatio * 0.25}) 100%)`;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px', padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px' }}>
        <div style={{ width: '110px', height: '180px', border: '1px solid var(--color-border)', borderRadius: '0 0 12px 12px', position: 'relative', background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fillHeight}%`, background: liquidGradient, transition: 'height 180ms ease, background 180ms ease' }} />
          <div style={{ position: 'absolute', inset: '12px 0 auto 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)' }}>
            농도
          </div>
          <div style={{ position: 'absolute', inset: 'auto 0 14px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--color-accent-fg)' }}>
            {concentration.toFixed(1)}%
          </div>
        </div>

        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {interactive ? (
            <>
              <SliderRow label="물의 양" value={waterAmount} unit="mL" min={50} max={400} onChange={setWaterAmount} />
              <SliderRow label="소금의 양" value={saltAmount} unit="g" min={0} max={120} onChange={setSaltAmount} />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
              <FixedRow label="물의 양" value={`${waterAmount} mL`} />
              <FixedRow label="소금의 양" value={`${saltAmount} g`} />
            </div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Stat label="물" value={`${waterAmount} mL`} />
        <Stat label="소금" value={`${saltAmount} g`} />
        <Stat label="전체 용액" value={`${total} 단위`} />
        <Stat label="실시간 농도" value={`${concentration.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function ValueInput({ label, value, min, max, onChange, unit }: { label: string; value: number; min: number; max: number; onChange: (next: number) => void; unit?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
      {label ? <span>{label}</span> : null}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        style={{ width: '68px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 6px' }}
      />
      {unit ? <span>{unit}</span> : null}
    </label>
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

function SliderRow({ label, value, unit, min, max, onChange }: { label: string; value: number; unit: string; min: number; max: number; onChange: (next: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
        <span>{label}</span>
        <ValueInput label="" value={value} min={min} max={max} onChange={onChange} unit={unit} />
      </div>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
    </div>
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
