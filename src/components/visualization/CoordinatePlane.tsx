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
}

// SVG 좌표계 상수 — LinearFunction, SystemOfEquations 과 동일한 좌표 기준 사용
const CX = 190; // origin x
const CY = 130; // origin y
const SX = 30;  // px per unit (x)
const SY = 30;  // px per unit (y)

function toSvg(x: number, y: number) {
  return { sx: CX + x * SX, sy: CY - y * SY };
}

function quadrantLabel(x: number, y: number): string {
  if (x === 0 || y === 0) return '축';
  if (x > 0 && y > 0) return '제1사분면';
  if (x < 0 && y > 0) return '제2사분면';
  if (x < 0 && y < 0) return '제3사분면';
  return '제4사분면';
}

export function CoordinatePlane({ points = [], interactive = true }: CoordinatePlaneProps) {
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
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '18px',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <svg
        width="380"
        height="270"
        viewBox="0 0 380 270"
        style={{ flexShrink: 0 }}
      >
        {/* 격자선 */}
        {ticks.map((t) => {
          const { sx } = toSvg(t, 0);
          const { sy } = toSvg(0, t);
          return (
            <g key={t}>
              <line
                x1={sx} y1={20} x2={sx} y2={250}
                stroke="var(--color-bg-surface)"
                strokeWidth="1"
              />
              <line
                x1={20} y1={sy} x2={360} y2={sy}
                stroke="var(--color-bg-surface)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* x축 */}
        <line x1="20" y1={CY} x2="360" y2={CY} stroke="var(--color-border)" strokeWidth="1.5" />
        {/* y축 */}
        <line x1={CX} y1="10" x2={CX} y2="260" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* 축 화살표 */}
        <polygon
          points={`360,${CY} 354,${CY - 4} 354,${CY + 4}`}
          fill="var(--color-border)"
        />
        <polygon
          points={`${CX},10 ${CX - 4},16 ${CX + 4},16`}
          fill="var(--color-border)"
        />

        {/* 축 레이블 */}
        <text
          x="368" y={CY + 4}
          fontFamily="var(--font-mono)" fontSize="12"
          fill="var(--color-text-muted)"
        >
          x
        </text>
        <text
          x={CX + 7} y="14"
          fontFamily="var(--font-mono)" fontSize="12"
          fill="var(--color-text-muted)"
        >
          y
        </text>

        {/* 눈금 & 숫자 */}
        {ticks.map((t) => {
          const { sx } = toSvg(t, 0);
          const { sy } = toSvg(0, t);
          return (
            <g key={`tick-${t}`}>
              {/* x축 눈금 */}
              <line x1={sx} y1={CY - 4} x2={sx} y2={CY + 4} stroke="var(--color-border)" strokeWidth="1" />
              <text
                x={sx} y={CY + 16}
                textAnchor="middle"
                fontFamily="var(--font-mono)" fontSize="10"
                fill="var(--color-text-muted)"
              >
                {t}
              </text>
              {/* y축 눈금 */}
              <line x1={CX - 4} y1={sy} x2={CX + 4} y2={sy} stroke="var(--color-border)" strokeWidth="1" />
              <text
                x={CX - 10} y={sy + 4}
                textAnchor="end"
                fontFamily="var(--font-mono)" fontSize="10"
                fill="var(--color-text-muted)"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* 원점 O */}
        <text
          x={CX - 12} y={CY + 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="10"
          fill="var(--color-text-muted)"
        >
          O
        </text>

        {/* 사분면 레이블 */}
        <text x={CX + 52} y={CY - 50} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅰ</text>
        <text x={CX - 52} y={CY - 50} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅱ</text>
        <text x={CX - 52} y={CY + 60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅲ</text>
        <text x={CX + 52} y={CY + 60} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-text-muted)" opacity="0.6">Ⅳ</text>

        {/* 점 렌더링 */}
        {displayPoints.map((pt, idx) => {
          const { sx, sy } = toSvg(pt.x, pt.y);
          const lbl = pt.label ?? String.fromCharCode(65 + (idx % 26));
          // 레이블 위치: 점 오른쪽 위 (경계 보정)
          const lx = sx + 7;
          const ly = sy - 7;
          return (
            <g key={idx}>
              <circle cx={sx} cy={sy} r="5" fill="var(--color-accent)" />
              <text
                x={lx} y={ly}
                fontFamily="var(--font-mono)" fontSize="11" fontWeight="600"
                fill="var(--color-accent)"
              >
                {lbl}({pt.x}, {pt.y})
              </text>
            </g>
          );
        })}
      </svg>

      {/* 컨트롤 패널 */}
      {interactive ? (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <NumberInput
              label="x좌표"
              value={inputX}
              min={-4}
              max={4}
              step={1}
              onChange={setInputX}
            />
            <NumberInput
              label="y좌표"
              value={inputY}
              min={-4}
              max={4}
              step={1}
              onChange={setInputY}
            />
            <button
              onClick={handleAdd}
              style={{
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: '5px',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-accent-fg)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              점 추가
            </button>
            {shown.length > points.length && (
              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '5px',
                  padding: '6px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                초기화
              </button>
            )}
          </div>

          {shown.length > 0 && (
            <div
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-bg-surface)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {shown.map((pt, idx) => {
                const lbl = pt.label ?? String.fromCharCode(65 + (idx % 26));
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-text)',
                      borderBottom:
                        idx < shown.length - 1
                          ? '1px solid var(--color-bg-surface)'
                          : 'none',
                      paddingBottom: idx < shown.length - 1 ? '5px' : '0',
                    }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>
                      {lbl}({pt.x}, {pt.y})
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {quadrantLabel(pt.x, pt.y)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        points.length > 0 && (
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-bg-surface)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {points.map((pt, idx) => {
              const lbl = pt.label ?? String.fromCharCode(65 + (idx % 26));
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-text)',
                    borderBottom:
                      idx < points.length - 1
                        ? '1px solid var(--color-bg-surface)'
                        : 'none',
                    paddingBottom: idx < points.length - 1 ? '5px' : '0',
                  }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>
                    {lbl}({pt.x}, {pt.y})
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {quadrantLabel(pt.x, pt.y)}
                  </span>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-text-muted)',
        flex: 1,
      }}
    >
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(
            Math.min(max, Math.max(min, Number(e.target.value) || 0))
          )
        }
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          padding: '5px 8px',
          borderRadius: '4px',
          width: '100%',
        }}
      />
    </label>
  );
}
