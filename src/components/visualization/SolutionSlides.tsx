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
      background: '#0c0d11',
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
              background: i < idx ? '#3a3a44' : i === idx ? '#d4ff4f' : '#26262d',
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
        color: '#3a3a44',
        textTransform: 'uppercase',
      }}>
        lim&#x2009;h&#x2009;→&#x2009;0
      </div>

      {/* Slide card */}
      <div style={{
        maxWidth: '540px',
        width: '100%',
        background: '#111114',
        border: `1px solid ${isFinal ? '#d4ff4f' : '#1e1e25'}`,
        borderRadius: '10px',
        padding: '32px 36px',
        boxShadow: isFinal ? '0 0 28px rgba(212,255,79,0.18)' : 'none',
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
      }}>
        {/* Step label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: isFinal ? '#d4ff4f' : '#5a5a66',
          marginBottom: '20px',
          transition: 'color 300ms ease',
        }}>
          {step.label}
        </div>

        {/* Formula */}
        <div style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          color: isFinal ? '#d4ff4f' : '#ececef',
          overflowX: 'auto',
        }}>
          <BlockMath math={step.tex} />
        </div>

        {/* Hint */}
        {step.hint && (
          <div style={{
            marginTop: '20px',
            padding: '10px 14px',
            background: '#0a0a0b',
            borderLeft: '2px solid #26262d',
            borderRadius: '0 4px 4px 0',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#5a5a66',
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
        color: '#3a3a44',
        letterSpacing: '0.1em',
      }}>
        {idx + 1} / {steps.length}
      </div>
    </div>
  );
}
