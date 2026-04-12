'use client';

interface HeadingBlockProps {
  level: 1 | 2 | 3;
  number?: string;
  text: string;
  eyebrow?: string;
}

export function HeadingBlock({ level, number, text, eyebrow }: HeadingBlockProps) {
  return (
    <div style={{ marginTop: level === 1 ? '48px' : level === 2 ? '36px' : '24px', marginBottom: '16px' }}>
      {eyebrow && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '6px' }}>
          {eyebrow}
        </p>
      )}
      {level === 1 && (
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-text)', margin: 0, lineHeight: 1.1 }} className="ko-text">
          {number && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', marginRight: '12px', verticalAlign: 'middle' }}>
              {number}
            </span>
          )}
          {text}
        </h1>
      )}
      {level === 2 && (
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--color-text)', margin: 0, lineHeight: 1.2 }} className="ko-text">
          {number && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginRight: '10px', verticalAlign: 'middle' }}>
              {number}
            </span>
          )}
          {text}
        </h2>
      )}
      {level === 3 && (
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-dim)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="ko-text">
          {text}
        </h3>
      )}
      {/* 액센트 밑줄 */}
      <div style={{ width: '24px', height: '2px', background: 'var(--color-accent)', marginTop: '8px' }} />
    </div>
  );
}
