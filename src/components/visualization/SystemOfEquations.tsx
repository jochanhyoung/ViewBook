'use client';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LineProps {
  slope: number;
  intercept: number;
}

interface SystemOfEquationsProps {
  line1: LineProps;
  line2: LineProps;
  interactive?: boolean;
}

// SVG 좌표계 — LinearFunction 과 동일한 기준
const CX = 190;
const CY = 125;
const SX = 24;
const SY = 18;

function toSvgX(x: number) { return CX + x * SX; }
function toSvgY(y: number) { return CY - y * SY; }

function linePoints(slope: number, intercept: number): string {
  const pts: string[] = [];
  for (let x = -6; x <= 6; x += 0.2) {
    pts.push(`${toSvgX(x)},${toSvgY(slope * x + intercept)}`);
  }
  return pts.join(' ');
}

function calcIntersection(l1: LineProps, l2: LineProps) {
  const denom = l1.slope - l2.slope;
  if (Math.abs(denom) < 1e-9) return null;
  const x = (l2.intercept - l1.intercept) / denom;
  const y = l1.slope * x + l1.intercept;
  return { x, y };
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}

// ── 정적 모드 (기존 동작 유지) ──────────────────────────────────
function StaticView({ line1, line2 }: { line1: LineProps; line2: LineProps }) {
  const intersection = useMemo(() => calcIntersection(line1, line2), [line1, line2]);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px', padding: '20px', overflowY: 'auto' }}>
      <svg width="380" height="250" viewBox="0 0 380 250" style={{ flexShrink: 0 }}>
        <line x1="20" y1={CY} x2="360" y2={CY} stroke="var(--color-border)" />
        <line x1={CX} y1="20" x2={CX} y2="230" stroke="var(--color-border)" />
        <polyline points={linePoints(line1.slope, line1.intercept)} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <polyline points={linePoints(line2.slope, line2.intercept)} fill="none" stroke="var(--color-accent-dim)" strokeWidth="3" />
        {intersection && (
          <>
            <circle cx={toSvgX(intersection.x)} cy={toSvgY(intersection.y)} r="6" fill="var(--color-text)" />
            <text x={toSvgX(intersection.x) + 8} y={toSvgY(intersection.y) - 8} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-text)">
              ({fmt(intersection.x)}, {fmt(intersection.y)})
            </text>
          </>
        )}
      </svg>

      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-surface)', borderRadius: '8px', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <StatRow label="직선 1" value={`y=${line1.slope}x${line1.intercept >= 0 ? '+' : ''}${line1.intercept}`} />
        <StatRow label="직선 2" value={`y=${line2.slope}x${line2.intercept >= 0 ? '+' : ''}${line2.intercept}`} />
        <StatRow label="해" value={intersection ? `(${fmt(intersection.x)}, ${fmt(intersection.y)})` : '없음 또는 무수히 많음'} />
        <StatRow label="해석" value="교점이 연립방정식의 해" />
      </div>
    </div>
  );
}

// ── 인터랙티브 모드 ──────────────────────────────────────────────
function InteractiveView({ line1: init1, line2: init2 }: { line1: LineProps; line2: LineProps }) {
  const [m1, setM1] = useState(init1.slope);
  const [b1, setB1] = useState(init1.intercept);
  const [m2, setM2] = useState(init2.slope);
  const [b2, setB2] = useState(init2.intercept);

  const intersection = useMemo(() => calcIntersection({ slope: m1, intercept: b1 }, { slope: m2, intercept: b2 }), [m1, b1, m2, b2]);
  const hasIntersection = intersection !== null;

  // SVG 경계 내에 교점이 표시 가능한지 확인
  const inView = hasIntersection &&
    Math.abs(intersection!.x) <= 5 &&
    Math.abs(intersection!.y) <= 5;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '20px', overflowY: 'auto' }}>
      {/* 그래프 */}
      <svg width="380" height="250" viewBox="0 0 380 250" style={{ flexShrink: 0 }}>
        {/* 격자선 */}
        {[-4,-3,-2,-1,1,2,3,4].map((t) => (
          <g key={t}>
            <line x1={toSvgX(t)} y1="20" x2={toSvgX(t)} y2="230" stroke="var(--color-bg-surface)" strokeWidth="1" />
            <line x1="20" y1={toSvgY(t)} x2="360" y2={toSvgY(t)} stroke="var(--color-bg-surface)" strokeWidth="1" />
          </g>
        ))}
        {/* 축 */}
        <line x1="20" y1={CY} x2="360" y2={CY} stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1={CX} y1="10" x2={CX} y2="240" stroke="var(--color-border)" strokeWidth="1.5" />
        {/* 축 눈금 숫자 */}
        {[-4,-3,-2,-1,1,2,3,4].map((t) => (
          <g key={`n${t}`}>
            <text x={toSvgX(t)} y={CY + 14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">{t}</text>
            <text x={CX - 8} y={toSvgY(t) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">{t}</text>
          </g>
        ))}
        <text x={CX - 8} y={CY + 14} textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-text-muted)">O</text>
        {/* 직선 1 (accent) */}
        <polyline points={linePoints(m1, b1)} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
        {/* 직선 2 (accent-dim) */}
        <polyline points={linePoints(m2, b2)} fill="none" stroke="var(--color-accent-dim)" strokeWidth="2.5" />
        {/* 교점 */}
        {inView && (
          <>
            {/* 교점 강조 링 */}
            <circle cx={toSvgX(intersection!.x)} cy={toSvgY(intersection!.y)} r="11" fill="var(--color-accent)" opacity="0.18" />
            <circle cx={toSvgX(intersection!.x)} cy={toSvgY(intersection!.y)} r="6" fill="var(--color-text)" />
            <text
              x={toSvgX(intersection!.x) + 10}
              y={toSvgY(intersection!.y) - 9}
              fontFamily="var(--font-mono)" fontSize="11" fontWeight="600"
              fill="var(--color-text)"
            >
              ({fmt(intersection!.x)}, {fmt(intersection!.y)})
            </text>
          </>
        )}
        {/* 직선 레이블 */}
        <text x="28" y="26" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-accent)">직선 1</text>
        <text x="28" y="40" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-accent-dim)">직선 2</text>
      </svg>

      {/* 컨트롤 */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 직선 1 */}
        <LineControls
          label="직선 1"
          accentColor="var(--color-accent)"
          slope={m1} intercept={b1}
          onSlope={setM1} onIntercept={setB1}
        />
        {/* 직선 2 */}
        <LineControls
          label="직선 2"
          accentColor="var(--color-accent-dim)"
          slope={m2} intercept={b2}
          onSlope={setM2} onIntercept={setB2}
        />
      </div>

      {/* 교점 피드백 배너 */}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <AnimatePresence mode="wait">
          {inView ? (
            <motion.div
              key="hit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              style={{
                background: 'var(--color-accent-bg)',
                border: '1px solid var(--color-accent)',
                borderRadius: '8px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '18px' }}>★</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)' }}>
                  교점 ({fmt(intersection!.x)}, {fmt(intersection!.y)})
                </div>
                <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                  이 교점이 바로 연립방정식의 해입니다.
                </div>
              </div>
            </motion.div>
          ) : hasIntersection ? (
            <motion.div
              key="offscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-bg-surface)',
                borderRadius: '8px',
                padding: '12px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              교점 ({fmt(intersection!.x)}, {fmt(intersection!.y)}) — 그래프 범위 밖
            </motion.div>
          ) : (
            <motion.div
              key="parallel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-bg-surface)',
                borderRadius: '8px',
                padding: '12px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              두 직선이 평행합니다 — 해가 없거나 무수히 많습니다.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export function SystemOfEquations({ line1, line2, interactive = false }: SystemOfEquationsProps) {
  return interactive
    ? <InteractiveView line1={line1} line2={line2} />
    : <StaticView line1={line1} line2={line2} />;
}

// ── 서브 컴포넌트 ────────────────────────────────────────────────
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}

function LineControls({
  label, accentColor, slope, intercept, onSlope, onIntercept,
}: {
  label: string; accentColor: string;
  slope: number; intercept: number;
  onSlope: (v: number) => void; onIntercept: (v: number) => void;
}) {
  return (
    <div style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-bg-surface)',
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: accentColor }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: accentColor, fontWeight: 600 }}>
          y = {slope.toFixed(1)}x {intercept >= 0 ? '+' : '−'} {Math.abs(intercept).toFixed(1)}
        </span>
      </div>
      {/* 기울기 슬라이더 */}
      <SliderRow
        label="기울기"
        value={slope}
        min={-5} max={5} step={0.5}
        onChange={onSlope}
      />
      {/* y절편 슬라이더 */}
      <SliderRow
        label="y절편"
        value={intercept}
        min={-8} max={8} step={0.5}
        onChange={onIntercept}
      />
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', width: '36px', flexShrink: 0 }}>
        {label}
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: 'var(--color-accent)' }}
      />
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        style={{
          width: '46px', background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px',
          padding: '3px 5px', borderRadius: '4px', textAlign: 'center',
        }}
      />
    </div>
  );
}
