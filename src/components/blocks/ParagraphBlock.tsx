'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ParagraphBlockProps {
  markdown: string;
}

export function ParagraphBlock({ markdown }: ParagraphBlockProps) {
  return (
    <div
      className="ko-text"
      style={{
        fontSize: '15.5px',
        lineHeight: 1.85,
        color: '#b8b8c0',
        marginBottom: '18px',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
          strong: ({ children }) => (
            <strong style={{ color: '#ececef', fontWeight: 600 }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ color: '#d8d8dd', fontStyle: 'italic' }}>{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              style={{
                color: '#d8d8dd',
                textDecoration: 'underline',
                textDecorationColor: '#d4ff4f',
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
