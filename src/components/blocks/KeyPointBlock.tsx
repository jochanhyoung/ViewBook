'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface KeyPointBlockProps {
  markdown: string;
}

export function KeyPointBlock({ markdown }: KeyPointBlockProps) {
  return (
    <div style={{ background: 'var(--color-accent-bg)', borderLeft: '3px solid var(--color-accent)', borderRadius: '0 4px 4px 0', padding: '16px 20px', marginTop: '24px', marginBottom: '24px' }}>
      <div className="ko-text" style={{ fontSize: '14.5px', lineHeight: 1.75, color: 'var(--color-text-dim)' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{children}</strong>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
