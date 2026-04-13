'use client';
import { useState, useCallback, useEffect } from 'react';
import { safeEval } from '@/lib/safe-math';

interface LimitDefinitionProps {
  fn: string;
  x0: number;
  subStep?: number;   // 0..4, 재생 모드에서 사용
  isPlaying?: boolean;
}

const PRESETS = [1, 0.5, 0.25, 0.1, 0.01] as const;
const H_MIN = 0.0001;
const H_MAX = 2;

export function LimitDefinition({ fn, x0, subStep = 0, isPlaying = false }: LimitDefinitionProps) {
  const [manualH, setManualH] = useState<number>(PRESETS[0]);
  const [textInput, setTextInput] = useState<string>('1');
  const [inputError, setInputError] = useState(false);

  // 재생이 끝나면 마지막 프리셋 값을 manualH로 동기화
  useEffect(() => {
    if (!isPlaying) {
      const snapped = PRESETS[Math.min(subStep, PRESETS.length - 1)];
      setManualH(snapped);
      setTextInput(String(snapped));
      setInputError(false);
    }
  }, [isPlaying, subStep]);

  const h = isPlaying ? PRESETS[Math.min(subStep, PRESETS.length - 1)] : manualH;

  const applyText = useCallback(() => {
    const v = Number(textInput);
    if (!Number.isFinite(v) || v === 0) { setInputError(true); return; }
    if (Math.abs(v) < H_MIN || Math.abs(v) > H_MAX) { setInputError(true); return; }
    setManualH(v);
    setInputError(false);
  }, [textInput]);

  const evalFn = useCallback(
    (x: number) => { try { return safeEval(fn, { x }); } catch { return 0; } },
    [fn]
  );

  const f0 = evalFn(x0);
  const fh = evalFn(x0 + h);
  const slope = (fh - f0) / h;
  const trueSlopeApprox = (evalFn(x0 + 0.0001) - f0) / 0.0001;

  const W = 400, H_SVG = 240;
  const xMin = x0 - 2, xMax = x0 + 2.5;
  const yMin = Math.min(f0, fh) - 1, yMax = Math.max(f0, fh) + 2;

  function toSvgX(x: number) { return ((x - xMin) / (xMax - xMin)) * W; }
  function toSvgY(y: number) { return H_SVG - ((y - yMin) / (yMax - yMin)) * H_SVG; }

  const curvePoints: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = xMin + (i / 100) * (xMax - xMin);
    curvePoints.push(`${toSvgX(x).toFixed(1)},${toSvgY(evalFn(x)).toFixed(1)}`);
  }

  const secantY1 = f0 + slope * (xMin - x0);
  const secantY2 = f0 + slope * (xMax - x0);
  const tangY1 = f0 + trueSlopeApprox * (xMin - x0);
  const tangY2 = f0 + trueSlopeApprox * (xMax - x0);

  const borderColor = inputError ? '#ff6b6b' : 'var(--color-border)';

  return (
    /*
     * ── 레이아웃 버그 수정 ──
     * 기존: height: '100%' → 부모 overflow:hidden 환경에서 하단 패널 잘림
     * 수정: minHeight: '100%' + overflowY: 'auto' → 내용이 넘치면 스크롤 허용
     * flexDirection: 'column' 유지하여 SVG → 컨트롤 → stats 순서 보장
     */
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px',
        gap: '16px',
      }}
    >
      {/*
       * SVG 래퍼에 paddingBottom 추가
       * — h 브라켓 레이블(y = toSvgY(f0)+36)이 SVG 하단 밖으로 나가는 문제 해결
       * — overflow: 'visible' 이므로 SVG 자체는 클리핑 안 되지만
       *   래퍼의 패딩이 레이아웃 공간을 확보해 줘야 함
       */}
      <div style={{ paddingBottom: '44px', flexShrink: 0 }}>
        <svg width={W} height={H_SVG} style={{ overflow: 'visible' }}>
          {/* tangent (limit) */}
          <line
            x1={toSvgX(xMin)} y1={toSvgY(tangY1)}
            x2={toSvgX(xMax)} y2={toSvgY(tangY2)}
            stroke="var(--color-accent)" strokeWidth="1"
            strokeOpacity={Math.max(0, 1 - Math.abs(h) * 3)}
            strokeDasharray="4 4"
          />
          {/* secant */}
          <line
            x1={toSvgX(xMin)} y1={toSvgY(secantY1)}
            x2={toSvgX(xMax)} y2={toSvgY(secantY2)}
            stroke="var(--color-accent-dim)" strokeWidth="1.5" strokeOpacity="0.85"
          />
          {/* curve */}
          <polyline points={curvePoints.join(' ')} fill="none" stroke="var(--color-text)" strokeWidth="2" />
          {/* points */}
          <circle cx={toSvgX(x0)} cy={toSvgY(f0)} r="4" fill="var(--color-accent)" />
          <circle cx={toSvgX(x0 + h)} cy={toSvgY(fh)} r="3" fill="var(--color-accent-dim)" />
          {/* h bracket (always visible) */}
          <line x1={toSvgX(x0)} y1={toSvgY(f0) + 22} x2={toSvgX(x0 + h)} y2={toSvgY(f0) + 22} stroke="var(--color-border)" strokeWidth="1" />
          <text x={(toSvgX(x0) + toSvgX(x0 + h)) / 2} y={toSvgY(f0) + 36}
            fill="var(--color-text-muted)" fontSize="13" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            h = {Number.isInteger(h) ? h : h.toPrecision(4)}
          </text>
          <text x={toSvgX(x0)} y={toSvgY(f0) - 12}
            fill="var(--color-accent)" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            ({x0}, {f0.toFixed(2)})
          </text>

          {/* Δx / Δy annotations — h가 충분히 클 때만 표시 */}
          {Math.abs(h) > 0.05 && (() => {
            const ax = toSvgX(x0);
            const bx = toSvgX(x0 + h);
            const ay = toSvgY(f0);
            const by = toSvgY(fh);
            const midX = (ax + bx) / 2;
            const midY = (ay + by) / 2;
            // Δy 수직 보조선: B의 x좌표에서 A의 y → B의 y
            const cornerX = bx;
            // opacity: h가 작아질수록 페이드아웃
            const opacity = Math.min(1, (Math.abs(h) - 0.05) / 0.15);
            return (
              <g opacity={opacity}>
                {/* Δx 수평 보조선 (A의 y 높이) */}
                <line x1={ax} y1={ay} x2={cornerX} y2={ay}
                  stroke="var(--color-vis-delta-x)" strokeWidth="1" strokeDasharray="4 3" />
                {/* Δy 수직 보조선 (B의 x 위치) */}
                <line x1={cornerX} y1={ay} x2={cornerX} y2={by}
                  stroke="var(--color-vis-delta-y)" strokeWidth="1" strokeDasharray="4 3" />
                {/* Δx 레이블 */}
                <text x={midX} y={ay + 14}
                  fill="var(--color-vis-delta-x-lb)" fontSize="13" textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace">
                  Δx = h
                </text>
                {/* Δy 레이블 */}
                <text x={cornerX + 8} y={midY}
                  fill="var(--color-vis-delta-y-lb)" fontSize="13" textAnchor="start"
                  fontFamily="JetBrains Mono, monospace" dominantBaseline="middle">
                  Δy
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Playing mode: preset buttons only */}
      {isPlaying && (
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {PRESETS.map((p, i) => (
            <div
              key={p}
              style={{
                padding: '4px 10px',
                border: '1px solid',
                borderColor: i === Math.min(subStep, PRESETS.length - 1) ? 'var(--color-accent)' : 'var(--color-border)',
                borderRadius: '3px',
                background: i === Math.min(subStep, PRESETS.length - 1) ? 'var(--color-accent-bg)' : 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: i === Math.min(subStep, PRESETS.length - 1) ? 'var(--color-accent)' : 'var(--color-text-ghost)',
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}

      {/* Paused mode: free input + preset shortcuts */}
      {!isPlaying && (
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
          {/* Preset buttons */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
              프리셋
            </span>
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => { setManualH(p); setTextInput(String(p)); setInputError(false); }}
                style={{
                  flex: 1,
                  background: manualH === p ? 'var(--color-accent-bg)' : 'none',
                  border: '1px solid',
                  borderColor: manualH === p ? 'var(--color-accent)' : 'var(--color-border)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: manualH === p ? 'var(--color-accent)' : 'var(--color-text-subtle)',
                  padding: '4px 0',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Free input row */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
              h =
            </span>
            <input
              type="number"
              step="any"
              value={textInput}
              onChange={(e) => { setTextInput(e.target.value); setInputError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') applyText(); }}
              placeholder={`±${H_MIN} ~ ±${H_MAX}`}
              style={{
                flex: 1,
                padding: '5px 10px',
                background: 'var(--color-bg-elevated)',
                border: `1px solid ${borderColor}`,
                borderRadius: '3px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              onClick={applyText}
              style={{
                background: 'none',
                border: '1px solid var(--color-accent)',
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-accent)',
                padding: '5px 12px',
                flexShrink: 0,
              }}
            >
              적용
            </button>
          </div>

          {/* Log slider */}
          <input
            type="range"
            min={Math.log10(H_MIN)}
            max={Math.log10(H_MAX)}
            step={0.01}
            value={Math.log10(Math.abs(manualH) || H_MIN)}
            onChange={(e) => {
              const v = parseFloat(Math.pow(10, Number(e.target.value)).toPrecision(4));
              setManualH(v);
              setTextInput(String(v));
              setInputError(false);
            }}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-bg-subtle)',
          borderRadius: '8px',
          padding: '14px 20px',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        {/* Large slope display */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            할선의 기울기
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--color-accent)', fontWeight: 'bold', lineHeight: 1 }}>
            {slope.toFixed(4)}
          </span>
        </div>

        {/* Computation formula */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)', textAlign: 'right' }}>
          = ({fh.toFixed(4)} − {f0.toFixed(4)}) / {Number.isInteger(h) ? h : h.toPrecision(3)}
        </div>

        {/* Convergence guide */}
        <div style={{ borderTop: '1px solid var(--color-bg-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)' }}>
            h → 0 이면
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent-dim)' }}>
            f′({x0}) ≈ {trueSlopeApprox.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
