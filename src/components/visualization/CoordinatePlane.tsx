'use client';
import { useState } from 'react';

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface CoordinatePlaneProps {
  points?: Point[];
  interactive?: boolean;
  showSigns?: boolean;
}

// SVG 좌표계 상수 — LinearFunction, SystemOfEquations 과 동일한 좌표 기준 사용
const CX = 190; // origin x (px)
const CY = 130; // origin y (px)
const SX = 30;  // px per unit (x)
const SY = 30;  // px per unit (y)

function toSvg(x: number, y: number) {
  return { sx: CX + x * SX, sy: CY - y * SY };
}

// showSigns 전용: 각 사분면 메타데이터
// dimBg 불투명도 0.18 → 라이트/다크 모드 모두에서 충분히 보임
// nameColor: 배경색보다 진한 채도로, 어두운 배경/밝은 배경 모두에서 가독성 확보
const QUADRANTS = [
  {
    id: 'q1', name: '제1사분면', xSign: 'x > 0', ySign: 'y > 0',
    bx: CX,   by: 10,  bw: 170,     bh: CY - 10,
    cx: CX + 85, cy: CY - 60,
    dimBg: 'rgba(74,222,128,0.18)', nameColor: '#15803d',
  },
  {
    id: 'q2', name: '제2사분면', xSign: 'x < 0', ySign: 'y > 0',
    bx: 20,   by: 10,  bw: CX - 20, bh: CY - 10,
    cx: CX - 85, cy: CY - 60,
    dimBg: 'rgba(59,130,246,0.18)', nameColor: '#1d4ed8',
  },
  {
    id: 'q3', name: '제3사분면', xSign: 'x < 0', ySign: 'y < 0',
    bx: 20,   by: CY,  bw: CX - 20, bh: 140,
    cx: CX - 85, cy: CY + 65,
    dimBg: 'rgba(249,115,22,0.18)',  nameColor: '#c2410c',
  },
  {
    id: 'q4', name: '제4사분면', xSign: 'x > 0', ySign: 'y < 0',
    bx: CX,   by: CY,  bw: 170,     bh: 140,
    cx: CX + 85, cy: CY + 65,
    dimBg: 'rgba(168,85,247,0.18)', nameColor: '#7e22ce',
  },
];

// ────────────────────────────────────────────
// 축·눈금 공통 SVG 레이어
// ────────────────────────────────────────────
function AxesLayer({ ticks }: { ticks: number[] }) {
  return (
    <>
      {/* 격자선 */}
      {ticks.map((t) => {
        const { sx } = toSvg(t, 0);
        const { sy } = toSvg(0, t);
        return (
          <g key={t}>
            <line x1={sx} y1={20} x2={sx} y2={250} stroke="var(--color-bg-surface)" strokeWidth="1" />
            <line x1={20} y1={sy} x2={360} y2={sy} stroke="var(--color-bg-surface)" strokeWidth="1" />
          </g>
        );
      })}
      {/* x축 */}
      <line x1="20" y1={CY} x2="360" y2={CY} stroke="var(--color-border)" strokeWidth="1.5" />
      {/* y축 */}
      <line x1={CX} y1="10" x2={CX} y2="260" stroke="var(--color-border)" strokeWidth="1.5" />
      {/* 화살표 */}
      <polygon points={`360,${CY} 354,${CY - 4} 354,${CY + 4}`} fill="var(--color-border)" />
      <polygon points={`${CX},10 ${CX - 4},16 ${CX + 4},16`}    fill="var(--color-border)" />
      {/* 축 레이블 */}
      <text x="368" y={CY + 4}  fontFamily="var(--font-mono)" fontSize="12" fill="var(--color-text-muted)">x</text>
      <text x={CX + 7} y="14"  fontFamily="var(--font-mono)" fontSize="12" fill="var(--color-text-muted)">y</text>
      {/* 눈금 */}
      {ticks.map((t) => {
        const { sx } = toSvg(t, 0);
        const { sy } = toSvg(0, t);
        return (
          <g key={`tick-${t}`}>
            <line x1={sx} y1={CY - 4} x2={sx} y2={CY + 4} stroke="var(--color-border)" strokeWidth="1" />
            <text x={sx} y={CY + 16} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{t}</text>
            <line x1={CX - 4} y1={sy} x2={CX + 4} y2={sy} stroke="var(--color-border)" strokeWidth="1" />
            <text x={CX - 10} y={sy + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">{t}</text>
          </g>
        );
      })}
      {/* 원점 */}
      <text x={CX - 12} y={CY + 14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)">O</text>
    </>
  );
}

// ────────────────────────────────────────────
// showSigns 모드: 배경 rect만 (격자선 아래)
// ────────────────────────────────────────────
function QuadrantBgsLayer() {
  return (
    <>
      {QUADRANTS.map((q) => (
        <rect key={q.id} x={q.bx} y={q.by} width={q.bw} height={q.bh} fill={q.dimBg} />
      ))}
    </>
  );
}

// ────────────────────────────────────────────
// showSigns 모드: 텍스트만 (격자선 위)
// ────────────────────────────────────────────
function QuadrantTextsLayer() {
  return (
    <>
      {QUADRANTS.map((q) => (
        <g key={q.id}>
          {/* 가독성을 위한 텍스트 배경 블러 */}
          <rect
            x={q.cx - 46} y={q.cy - 16}
            width="92" height="52"
            rx="6"
            fill={q.dimBg}
            opacity="0.85"
          />
          {/* 사분면 이름 (한글) */}
          <text
            x={q.cx} y={q.cy}
            textAnchor="middle"
            fontFamily="var(--font-sans, sans-serif)"
            fontSize="13"
            fontWeight="700"
            fill={q.nameColor}
          >
            {q.name}
          </text>
          {/* x 부호 */}
          <text
            x={q.cx} y={q.cy + 17}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill={q.nameColor}
          >
            {q.xSign}
          </text>
          {/* y 부호 */}
          <text
            x={q.cx} y={q.cy + 30}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill={q.nameColor}
          >
            {q.ySign}
          </text>
        </g>
      ))}
    </>
  );
}

// ────────────────────────────────────────────
// 일반 모드: 작은 사분면 로마 숫자만
// ────────────────────────────────────────────
function QuadrantRomanLayer() {
  return (
    <>
      <text x={CX + 52} y={CY - 50} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅰ</text>
      <text x={CX - 52} y={CY - 50} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅱ</text>
      <text x={CX - 52} y={CY + 60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅲ</text>
      <text x={CX + 52} y={CY + 60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅳ</text>
    </>
  );
}

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
export function CoordinatePlane({ points = [], interactive = true, showSigns = false }: CoordinatePlaneProps) {
  const [inputX, setInputX] = useState(3);
  const [inputY, setInputY] = useState(2);
  const [shown, setShown] = useState<Point[]>(points);

  function handleAdd() {
    const nx = Math.round(inputX * 10) / 10;
    const ny = Math.round(inputY * 10) / 10;
    const label = String.fromCharCode(65 + (shown.length % 26));
    setShown((prev) => [...prev, { x: nx, y: ny, label }]);
  }

  function handleReset() {
    setShown(points);
  }

  const displayPoints = interactive ? shown : points;
  const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-5">
      <div className="aspect-[380/270] w-full max-w-[420px]">
      <svg width="380" height="270" viewBox="0 0 380 270" className="h-full w-full" style={{ flexShrink: 0 }}>
        {/* 1) 사분면 배경 색조 — 격자선 아래 */}
        {showSigns && <QuadrantBgsLayer />}

        {/* 2) 축·눈금·격자선 */}
        <AxesLayer ticks={ticks} />

        {/* 3) 사분면 텍스트 — 격자선 위 */}
        {showSigns ? <QuadrantTextsLayer /> : <QuadrantRomanLayer />}

        {/* 점 렌더링 */}
        {displayPoints.map((pt, idx) => {
          const { sx, sy } = toSvg(pt.x, pt.y);
          const lbl = pt.label ?? String.fromCharCode(65 + (idx % 26));
          return (
            <g key={idx}>
              <circle cx={sx} cy={sy} r="5" fill="var(--color-accent)" />
              <text
                x={sx + 7} y={sy - 7}
                fontFamily="var(--font-mono)" fontSize="11" fontWeight="600"
                fill="var(--color-accent)"
              >
                {lbl}({pt.x}, {pt.y})
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {/* ── showSigns 모드: 범례 패널 ── */}
      {showSigns && (
        <div className="grid w-full max-w-[420px] grid-cols-1 gap-2 sm:grid-cols-2">
          {QUADRANTS.map((q) => (
            <div
              key={q.id}
              style={{
                background: q.dimBg,
                border: `1px solid ${q.nameColor}44`,
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', fontWeight: 700, color: q.nameColor }}>
                {q.name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: q.nameColor }}>
                {q.xSign},  {q.ySign}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── 일반 모드: 컨트롤 패널 ── */}
      {!showSigns && interactive && (
        <div className="flex w-full max-w-[420px] flex-col gap-2.5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-end">
            <NumberInput label="x좌표" value={inputX} min={-4} max={4} step={1} onChange={setInputX} />
            <NumberInput label="y좌표" value={inputY} min={-4} max={4} step={1} onChange={setInputY} />
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto"
              style={{
                background: 'var(--color-accent)', border: 'none', borderRadius: '5px',
                padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'var(--color-accent-fg)', cursor: 'pointer', flexShrink: 0,
              }}
            >
              점 추가
            </button>
            {shown.length > points.length && (
              <button
                onClick={handleReset}
                className="w-full sm:w-auto"
                style={{
                  background: 'none', border: '1px solid var(--color-border)', borderRadius: '5px',
                  padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--color-text-muted)', cursor: 'pointer', flexShrink: 0,
                }}
              >
                초기화
              </button>
            )}
          </div>
          {shown.length > 0 && (
            <PointTable points={shown} />
          )}
        </div>
      )}

      {/* ── 일반 모드 + 정적 점 목록 ── */}
      {!showSigns && !interactive && points.length > 0 && (
        <PointTable points={points} />
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// 서브 컴포넌트
// ────────────────────────────────────────────
function PointTable({ points }: { points: Point[] }) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-1.5" style={{
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-bg-surface)',
      borderRadius: '8px', padding: '12px 16px',
    }}>
      {points.map((pt, idx) => {
        const lbl = pt.label ?? String.fromCharCode(65 + (idx % 26));
        return (
          <div
            key={idx}
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text)',
              borderBottom: idx < points.length - 1 ? '1px solid var(--color-bg-surface)' : 'none',
              paddingBottom: idx < points.length - 1 ? '5px' : '0',
            }}
          >
            <span style={{ color: 'var(--color-accent)' }}>{lbl}({pt.x}, {pt.y})</span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {pt.x === 0 || pt.y === 0 ? '축' :
               pt.x > 0 && pt.y > 0 ? '제1사분면' :
               pt.x < 0 && pt.y > 0 ? '제2사분면' :
               pt.x < 0 && pt.y < 0 ? '제3사분면' : '제4사분면'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function NumberInput({
  label, value, min, max, step, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', flex: 1 }}>
      {label}
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
        style={{
          background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
          color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '13px',
          padding: '5px 8px', borderRadius: '4px', width: '100%',
        }}
      />
    </label>
  );
}
