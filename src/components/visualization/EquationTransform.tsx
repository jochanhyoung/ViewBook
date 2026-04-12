'use client';
import { BlockMath } from 'react-katex';

interface EquationTransformProps {
  steps: {
    label: string;
    latex: string;
    description?: string;
    highlight?: boolean;
  }[];
  subStepIndex: number;
}

export function EquationTransform({ steps, subStepIndex }: EquationTransformProps) {
  const visibleSteps = steps.slice(0, subStepIndex + 1);

  return (
    <div style={{ padding: '32px 20px', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', maxWidth: '600px' }}>
        {visibleSteps.map((s, i) => {
          const isCurrent = i === visibleSteps.length - 1;
          const bg = s.highlight
            ? 'var(--color-accent-bg-hi)'
            : isCurrent
              ? 'var(--color-bg-surface)'
              : 'var(--color-bg-elevated)';
          const border = s.highlight
            ? '1px solid var(--color-accent)'
            : isCurrent
              ? '1px solid var(--color-text-ghost)'
              : '1px solid var(--color-border)';
          const color = s.highlight
            ? 'var(--color-accent)'
            : isCurrent
              ? 'var(--color-text)'
              : 'var(--color-text-subtle)';

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
              {/* 레이블 */}
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </span>
              {/* 수식 박스 */}
              <div
                style={{
                  background: bg,
                  border: border,
                  color: color,
                  borderRadius: '12px',
                  padding: '24px 32px',
                  fontSize: '1.6rem',
                  opacity: (!isCurrent && !s.highlight) ? 0.6 : 1,
                  transition: 'all 300ms ease',
                  width: '100%',
                  textAlign: 'center',
                  overflowX: 'auto',
                }}
              >
                <BlockMath math={s.latex} />
              </div>
              {/* 설명 텍스트 */}
              {s.description && isCurrent && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-subtle)', marginTop: '4px', textAlign: 'center' }}>{s.description}</p>
              )}
              {/* 단계 간 화살표 */}
              {i < visibleSteps.length - 1 && (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '20px', marginTop: '8px' }}>↓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
