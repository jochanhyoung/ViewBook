'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface KeyPointBlockProps {
  markdown: string;
}

export function KeyPointBlock({ markdown }: KeyPointBlockProps) {
  return (
    <div
      style={{
        background: 'rgba(212, 255, 79, 0.05)',
        borderLeft: '3px solid #d4ff4f',
        borderRadius: '0 4px 4px 0',
        padding: '16px 20px',
        marginTop: '24px',
        marginBottom: '24px',
      }}
    >
      <div
        className="ko-text"
        style={{
          fontSize: '14.5px',
          lineHeight: 1.75,
          color: '#d8d8dd',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
            strong: ({ children }) => (
              <strong style={{ color: '#d4ff4f', fontWeight: 600 }}>{children}</strong>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
