'use client';
import { BlockMath } from 'react-katex';

interface EquationBlockProps {
  latex: string;
  caption?: string;
  id?: string;
}

export function EquationBlock({ latex, caption }: EquationBlockProps) {
  return (
    <div
      style={{
        borderTop: '1px solid #1a1a1f',
        borderBottom: '1px solid #1a1a1f',
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
            color: '#5a5a66',
            maxWidth: '120px',
            lineHeight: 1.5,
            flexShrink: 0,
            textAlign: 'right',
          }}
          className="ko-text"
        >
          {caption}
        </p>
      )}
    </div>
  );
}
