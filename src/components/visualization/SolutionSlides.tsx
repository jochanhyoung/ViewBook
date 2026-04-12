'use client';
import { BlockMath } from 'react-katex';

interface SolutionSlidesProps {
  steps: { label: string; tex: string; hint?: string; final?: boolean }[];
  subStep?: number;
  isPlaying?: boolean;
}

export function SolutionSlides({ steps, subStep = 0 }: SolutionSlidesProps) {
  const idx = Math.min(Math.max(0, subStep), steps.length - 1);
  const step = steps[idx];
  const isFinal = step.final === true;

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
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {steps.map((s, i) => (
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

      {/* lim indicator */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: 'var(--color-text-ghost)',
        textTransform: 'uppercase',
      }}>
        lim&#x2009;h&#x2009;→&#x2009;0
      </div>

      {/* Slide card */}
      <div style={{
        maxWidth: '540px',
        width: '100%',
        background: 'var(--color-bg-elevated)',
        border: `1px solid ${isFinal ? 'var(--color-accent)' : 'var(--color-bg-subtle)'}`,
        borderRadius: '10px',
        padding: '32px 36px',
        boxShadow: isFinal ? '0 0 28px var(--color-accent-bg)' : 'none',
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
      }}>
        {/* Step label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: isFinal ? 'var(--color-accent)' : 'var(--color-text-muted)',
          marginBottom: '20px',
          transition: 'color 300ms ease',
        }}>
          {step.label}
        </div>

        {/* Formula */}
        <div style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          color: isFinal ? 'var(--color-accent)' : 'var(--color-text)',
          overflowX: 'auto',
        }}>
          <BlockMath math={step.tex} />
        </div>

        {/* Hint */}
        {step.hint && (
          <div style={{
            marginTop: '20px',
            padding: '10px 14px',
            background: 'var(--color-bg)',
            borderLeft: '2px solid var(--color-border)',
            borderRadius: '0 4px 4px 0',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.65,
            }}>
              {step.hint}
            </span>
          </div>
        )}
      </div>

      {/* Step counter */}
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
