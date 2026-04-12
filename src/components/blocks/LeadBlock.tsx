'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface LeadBlockProps {
  markdown: string;
}

export function LeadBlock({ markdown }: LeadBlockProps) {
  return (
    <div className="ko-text" style={{ fontSize: '16px', lineHeight: 1.9, color: 'var(--color-text-dim)', marginBottom: '28px' }}>
      {/* 드롭캡 색상도 CSS 변수 사용 */}
      <style>{`
        .lead-block > p:first-of-type::first-letter {
          font-family: var(--font-display);
          font-size: 3.2rem;
          float: left;
          margin-right: 8px;
          margin-top: 4px;
          line-height: 0.85;
          color: var(--color-accent);
        }
      `}</style>
      <div className="lead-block">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: 0, marginBottom: '16px' }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{children}</strong>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
