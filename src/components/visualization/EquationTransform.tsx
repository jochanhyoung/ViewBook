'use client';
import { AnimatePresence, motion } from 'framer-motion';
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
  const idx = Math.min(Math.max(0, subStepIndex), steps.length - 1);
  const current = steps[idx];
  const isFinal = current.highlight === true;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '20px',
      background: 'var(--color-bg)',
      overflowY: 'auto',
    }}>
      {/* 진행 점 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? '18px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i < idx
                ? 'var(--color-text-ghost)'
                : i === idx
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              transition: 'all 250ms ease',
            }}
          />
        ))}
      </div>

      {/* 단계 레이블 */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: isFinal ? 'var(--color-accent)' : 'var(--color-text-ghost)',
        transition: 'color 300ms ease',
      }}>
        {current.label}
      </div>

      {/* 수식 카드 — 스텝 변경 시 fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            maxWidth: '540px',
            width: '100%',
            background: isFinal ? 'var(--color-accent-bg)' : 'var(--color-bg-elevated)',
            border: `1px solid ${isFinal ? 'var(--color-accent)' : 'var(--color-bg-subtle)'}`,
            borderRadius: '10px',
            padding: '32px 36px',
            fontSize: '1.6rem',
            textAlign: 'center',
            color: isFinal ? 'var(--color-accent)' : 'var(--color-text)',
            boxShadow: isFinal ? '0 0 28px var(--color-accent-bg)' : 'none',
            transition: 'border-color 300ms ease, box-shadow 300ms ease',
            overflowX: 'auto',
          }}
        >
          <BlockMath math={current.latex} />
        </motion.div>
      </AnimatePresence>

      {/* 설명 */}
      {current.description && (
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-subtle)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {current.description}
        </p>
      )}

      {/* 스텝 카운터 */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-text-ghost)',
        letterSpacing: '0.1em',
      }}>
        {idx + 1} / {steps.length}
      </div>
    </div>
  );
}
