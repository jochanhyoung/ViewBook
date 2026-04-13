'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface DefinitionBlockProps {
  id: string;
  term: string;
  body: string;
}

export function DefinitionBlock({ term, body }: DefinitionBlockProps) {
  return (
    <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: '24px', paddingTop: '16px', paddingBottom: '16px', marginTop: '24px', marginBottom: '24px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-dim)', marginBottom: '8px' }}>
        정의
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-text)', marginBottom: '10px', fontWeight: 400 }} className="ko-text">
        {term}
      </p>
      <div className="ko-text" style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{children}</strong>,
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
