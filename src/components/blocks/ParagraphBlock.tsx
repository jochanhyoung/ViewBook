'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ParagraphBlockProps {
  markdown: string;
}

export function ParagraphBlock({ markdown }: ParagraphBlockProps) {
  return (
    <div className="ko-text" style={{ fontSize: '17px', lineHeight: 1.9, color: 'var(--color-text)', fontWeight: 450, marginBottom: '18px' }}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
          strong: ({ children }) => <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: 'var(--color-text-dim)', fontStyle: 'italic' }}>{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              style={{
                color: 'var(--color-text-dim)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--color-accent)',
                textUnderlineOffset: '4px',
              }}
            >
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
