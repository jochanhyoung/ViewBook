'use client';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { BlockMath } from 'react-katex';

interface StepTextProps {
  latex?: string;
  markdown?: string;
}

export function StepText({ latex, markdown }: StepTextProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '24px', textAlign: 'center' }}>
      {latex && (
        <div style={{ fontSize: '1.8rem' }}>
          <BlockMath math={latex} />
        </div>
      )}
      {markdown && (
        <div
          className="ko-text"
          style={{ fontSize: '15px', lineHeight: 1.8, color: '#b8b8c0', maxWidth: '400px' }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#ececef' }}>{children}</strong>,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
