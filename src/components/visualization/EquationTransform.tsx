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
          const bg = s.highlight ? 'rgba(212, 255, 79, 0.2)' : isCurrent ? '#1a1a1f' : '#111114';
          const border = s.highlight ? '1px solid #d4ff4f' : isCurrent ? '1px solid #3a3a44' : '1px solid #26262d';
          const color = s.highlight ? '#d4ff4f' : isCurrent ? '#ececef' : '#8a8a96';
          
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
              {/* 레이블 */}
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#5a5a66', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
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
                <p style={{ fontSize: '13px', color: '#8a8a96', marginTop: '4px', textAlign: 'center' }}>{s.description}</p>
              )}

              {/* 단계 간 화살표 */}
              {i < visibleSteps.length - 1 && (
                <span style={{ color: '#5a5a66', fontSize: '20px', marginTop: '8px' }}>↓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
