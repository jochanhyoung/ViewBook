'use client';
import { BlockMath } from 'react-katex';
import { LatexTextRenderer } from '@/components/inline/LatexTextRenderer';

function balanceDollar(text: string): string {
  const count = (text.match(/\$/g) ?? []).length;
  return count % 2 !== 0 ? text + '$' : text;
}

function normalizeLatex(tex: string): string {
  const fixed = tex
    .trim()
    // 순수 수식만 $...$로 감싸진 경우 벗겨냄 (한국어 없는 경우)
    .replace(/^\$(.*)\$$/, (_, inner) => (/[가-힣]/.test(inner) ? `$${inner}$` : inner))
    .trim()
    .replace(/¥rac/g, '\\frac')
    .replace(/¥/g, '\\')
    .replace(/(?<!\\)(?<![a-z])ext\{/g, '\\text{')
    .replace(/(?<!\\)frac\{/g, '\\frac{')
    .replace(/(?<!\\)sqrt\{/g, '\\sqrt{')
    .replace(/\\?extlim/g, '\\lim')
    .replace(/\\operatorname\{lim\}/g, '\\lim')
    .replace(/\\mathop\{lim\}/g, '\\lim')
    // ^ 또는 _ 뒤에 붙은 공백/탭 제거 (KaTeX 파싱 실패 방지)
    .replace(/([_^])\s+/g, '$1');
  return fixed;
}

function SafeMath({ tex }: { tex: string }) {
  console.log('[SafeMath raw]', JSON.stringify(tex));
  const normalized = normalizeLatex(tex);
  console.log('[SafeMath normalized]', JSON.stringify(normalized));
  const hasKorean = /[가-힣]/.test(normalized);
  if (hasKorean) return (
    <p style={{ fontSize: '1rem', lineHeight: 1.7, textAlign: 'center' }}>
      <LatexTextRenderer text={balanceDollar(normalized)} />
    </p>
  );
  return <BlockMath math={normalized} />;
}

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
          <div key={i} style={{ width: i === idx ? '18px' : '6px', height: '6px', borderRadius: '3px', background: i < idx ? 'var(--color-text-ghost)' : i === idx ? 'var(--color-accent)' : 'var(--color-border)', transition: 'all 250ms ease' }} />
        ))}
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
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: isFinal ? 'var(--color-accent)' : 'var(--color-text-muted)',
          marginBottom: '28px',
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
          <SafeMath tex={step.tex} />
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
            <LatexTextRenderer text={step.hint} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.65 }} />
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
