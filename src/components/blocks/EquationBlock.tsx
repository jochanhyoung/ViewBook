'use client';
import { BlockMath } from 'react-katex';
import { LatexTextRenderer } from '@/components/inline/LatexTextRenderer';

interface EquationBlockProps {
  latex: string;
  caption?: string;
  id?: string;
}

export function EquationBlock({ latex, caption }: EquationBlockProps) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-bg-surface)',
        paddingTop: '24px',
        paddingBottom: '24px',
        marginTop: '24px',
        marginBottom: '24px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <div style={{ flex: 1, textAlign: 'center' }}>
        <BlockMath math={latex} />
      </div>
      {caption && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            maxWidth: '120px',
            lineHeight: 1.5,
            flexShrink: 0,
            textAlign: 'right',
          }}
          className="ko-text"
        >
          <LatexTextRenderer text={caption} />
        </p>
      )}
    </div>
  );
}
