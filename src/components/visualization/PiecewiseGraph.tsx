'use client';
// 조각함수 미분가능성 시각화 — 좌/우미분 토글 인터랙티브 그래프
// pieces: 구간별 함수 배열 / x0: 미분가능성 확인 지점
import { useState, useCallback } from 'react';
import { safeEval } from '@/lib/safe-math';

interface Piece {
  fn: string;
  fnLatex: string;
  condition: string;
  domain: [number, number];
}

interface PiecewiseGraphProps {
  pieces: Piece[];
  x0: number;
}

const H_PRESETS = [0.5, 0.25, 0.1, 0.05, 0.01] as const;
const H_MIN = 0.001;
const H_MAX = 1;

export function PiecewiseGraph({ pieces, x0 }: PiecewiseGraphProps) {
  const [h, setH] = useState(0.5);
  const [side, setSide] = useState<'right' | 'left'>('right');

  // x에 해당하는 조각 선택 후 평가
  const evalAt = useCallback((x: number): number => {
    for (const piece of pieces) {
      const [lo, hi] = piece.domain;
      if (x >= lo && x <= hi) {
        try { return safeEval(piece.fn, { x }); } catch { return NaN; }
      }
    }
    return NaN;
  }, [pieces]);

  const fa   = evalAt(x0);
  const hSigned = side === 'right' ? h : -h;
  const fah  = evalAt(x0 + hSigned);
  const secantSlope = isFinite(fa) && isFinite(fah) ? (fah - fa) / hSigned : 0;

  // 수치 미분으로 좌/우 극한 근사
  const eps = 0.00005;
  const rightLimit = (evalAt(x0 + eps) - evalAt(x0)) / eps;
  const leftLimit  = (evalAt(x0) - evalAt(x0 - eps)) / eps;
  const currentLimit = side === 'right' ? rightLimit : leftLimit;

  // CSS 변수 — 다크/라이트 모드 자동 전환
  const accentColor = side === 'right' ? 'var(--color-accent)' : 'var(--color-vis-min)';
  const accentDimColor = side === 'right' ? 'var(--color-accent-dim)' : 'var(--color-vis-min)';
  const accentBg = side === 'right' ? 'var(--color-accent-bg)' : 'var(--color-vis-neg-bg)';

  const W = 380, H_SVG = 220;
  // 전체 도메인: pieces의 domain 합집합 + 여백
  const allDomains = pieces.flatMap(p => p.domain);
  const xMin = Math.min(...allDomains) - 0.3;
  const xMax = Math.max(...allDomains) + 0.3;

  // y 범위: 각 조각을 샘플링해서 결정
  const ySamples: number[] = [];
  for (const piece of pieces) {
    for (let i = 0; i <= 30; i++) {
      const x = piece.domain[0] + (i / 30) * (piece.domain[1] - piece.domain[0]);
      const y = evalAt(x);
      if (isFinite(y)) ySamples.push(y);
    }
  }
  const yPad = 1.2;
  const rawYMin = Math.min(...ySamples, fa, fah);
  const rawYMax = Math.max(...ySamples, fa, fah);
  const yMin = rawYMin - yPad;
  const yMax = rawYMax + yPad;

  function toX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toY(y: number) { return H_SVG - ((y - yMin) / (yMax - yMin)) * H_SVG; }

  // 각 조각별 polyline 포인트 생성
  const piecePoints = pieces.map(piece => {
    const pts: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = piece.domain[0] + (i / 80) * (piece.domain[1] - piece.domain[0]);
      const y = evalAt(x);
      if (isFinite(y)) pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
    }
    return pts;
  });

  const ax = toX(x0),          ay = toY(fa);
  const bx = toX(x0 + hSigned), by = toY(fah);

  // 할선 끝점 (SVG 범위 내로 확장)
  const secY1 = fa + secantSlope * (xMin - x0);
  const secY2 = fa + secantSlope * (xMax - x0);

  // 극한 접선 (h→0 에 가까울수록 나타남)
  const tanY1 = fa + currentLimit * (xMin - x0);
  const tanY2 = fa + currentLimit * (xMax - x0);

  const ox = toX(0), oy = toY(0);

  // x0에서 연속 여부 (양방향 극한이 f(x0)에 가까운지)
  const limAtX0Right = evalAt(x0 + eps);
  const limAtX0Left  = evalAt(x0 - eps);
  const isContinuous = Math.abs(limAtX0Right - fa) < 0.01 && Math.abs(limAtX0Left - fa) < 0.01;
  const isDifferentiable = Math.abs(rightLimit - leftLimit) < 0.01;

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-start gap-3.5 overflow-y-auto p-4 sm:p-5">

      {/* 좌/우미분 토글 */}
      <div className="flex w-full max-w-[380px] gap-1.5 overflow-x-auto pb-1 sm:justify-center">
        {([
          ['right', '우미분 (h → 0⁺)'] as const,
          ['left',  '좌미분 (h → 0⁻)'] as const,
        ]).map(([s, label]) => {
          const isActive = side === s;
          const btnAccent = s === 'right' ? 'var(--color-accent)' : 'var(--color-vis-min)';
          const btnBg = s === 'right' ? 'var(--color-accent-bg)' : 'var(--color-vis-neg-bg)';
          return (
            <button
              key={s}
              onClick={() => setSide(s)}
              className="shrink-0 whitespace-nowrap"
              style={{
                padding: '6px 16px',
                border: `1px solid ${isActive ? btnAccent : 'var(--color-border)'}`,
                borderRadius: '4px',
                background: isActive ? btnBg : 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: isActive ? btnAccent : 'var(--color-text-dim)',
                transition: 'all 150ms',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* SVG 그래프 */}
      <div className="w-full max-w-[420px] flex-shrink-0">
        <svg width={W} height={H_SVG} viewBox={`0 0 ${W} ${H_SVG}`} className="block h-auto w-full overflow-visible">
          {/* x축, y축 */}
          <line x1={toX(xMin)} y1={oy} x2={toX(xMax)} y2={oy} stroke="var(--color-border)" strokeWidth="1" />
          <line x1={ox} y1={0}  x2={ox} y2={H_SVG}     stroke="var(--color-border)" strokeWidth="1" />

          {/* 극한 접선 (h→0 페이드인) */}
          {isFinite(tanY1) && isFinite(tanY2) && (
            <line
              x1={toX(xMin)} y1={toY(tanY1)}
              x2={toX(xMax)} y2={toY(tanY2)}
              style={{ stroke: accentColor }} strokeWidth="1" strokeDasharray="5 4"
              strokeOpacity={Math.max(0, 1 - h * 5)}
            />
          )}

          {/* 할선 */}
          {isFinite(secY1) && isFinite(secY2) && (
            <line
              x1={toX(xMin)} y1={toY(secY1)}
              x2={toX(xMax)} y2={toY(secY2)}
              style={{ stroke: accentDimColor }} strokeWidth="1.6" strokeOpacity="0.85"
            />
          )}

          {/* 각 조각 곡선 */}
          {piecePoints.map((pts, i) => (
            pts.length > 0 && (
              <polyline key={i} points={pts.join(' ')} fill="none" stroke="var(--color-text)" strokeWidth="2" />
            )
          ))}

          {/* x0 에서 불연속 표시 (열린/닫힌 원) */}
          {!isContinuous && (
            <circle cx={toX(x0)} cy={toY(limAtX0Left)} r="4"
              fill="var(--color-bg)" stroke="var(--color-text)" strokeWidth="1.5" />
          )}
          {/* x0 의 실제 함수값 */}
          {isFinite(fa) && (
            <circle cx={ax} cy={ay} r="5" fill="var(--color-accent)" />
          )}

          {/* 점 B */}
          {isFinite(fah) && (
            <>
              <circle cx={bx} cy={by} r="4" style={{ fill: accentColor }} />
              <text
                x={side === 'right' ? bx + 6 : bx - 6}
                y={by - 8}
                style={{ fill: accentColor }} fontSize="13"
                textAnchor={side === 'right' ? 'start' : 'end'}
                fontFamily="JetBrains Mono, monospace"
              >
                B
              </text>
            </>
          )}
        </svg>
      </div>

      {/* |h| 프리셋 + 슬라이더 */}
      <div className="flex w-full max-w-[380px] flex-shrink-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', flexShrink: 0 }}>|h| =</span>
          {H_PRESETS.map((p) => {
            const active = Math.abs(h - p) < 0.0001;
            return (
              <button
                key={p}
                onClick={() => setH(p)}
                style={{
                  flex: 1,
                  minWidth: '54px',
                  background: active ? accentBg : 'none',
                  border: `1px solid ${active ? accentColor : 'var(--color-border)'}`,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: active ? accentColor : 'var(--color-text-dim)',
                  padding: '4px 0',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
        <input
          type="range"
          min={Math.log10(H_MIN)}
          max={Math.log10(H_MAX)}
          step={0.01}
          value={Math.log10(h || H_MIN)}
          onChange={(e) => setH(parseFloat(Math.pow(10, Number(e.target.value)).toPrecision(3)))}
          style={{ width: '100%', accentColor: accentColor }}
        />
      </div>

      {/* 수렴값 패널 */}
      <div className="flex w-full max-w-[380px] flex-shrink-0 flex-col gap-2.5" style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-bg-subtle)',
        borderRadius: '8px',
        padding: '14px 20px',
      }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {side === 'right' ? '우미분 극한' : '좌미분 극한'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: accentColor as string, fontWeight: 'bold', lineHeight: 1, marginTop: '4px' }}>
              {secantSlope.toFixed(4)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              ({isFinite(fah) ? fah.toFixed(4) : 'N/A'} − {fa.toFixed(4)}) / {hSigned > 0 ? h.toPrecision(3) : `(−${h.toPrecision(3)})`}
            </div>
          </div>
          <div className="sm:text-right" style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              수렴값
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: accentColor as string, fontWeight: 'bold', lineHeight: 1, marginTop: '4px' }}>
              {isFinite(currentLimit) ? currentLimit.toFixed(4) : 'N/A'}
            </div>
          </div>
        </div>

        {/* 결론 */}
        <div style={{
          borderTop: '1px solid var(--color-bg-subtle)',
          paddingTop: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: isDifferentiable ? 'var(--color-accent)' : 'var(--color-vis-min)',
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}>
          {isDifferentiable
            ? `우미분 = 좌미분 = ${rightLimit.toFixed(4)} → x=${x0} 에서 미분가능`
            : `우미분(${rightLimit.toFixed(4)}) ≠ 좌미분(${leftLimit.toFixed(4)}) → x=${x0} 에서 미분불가능`}
        </div>
      </div>
    </div>
  );
}
