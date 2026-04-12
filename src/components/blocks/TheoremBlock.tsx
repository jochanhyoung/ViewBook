'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface TheoremBlockProps {
  id: string;
  number: string;
  statement: string;
  proof?: string;
}

export function TheoremBlock({ number, statement, proof }: TheoremBlockProps) {
  const [proofOpen, setProofOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #26262d',
        borderRadius: '6px',
        padding: '20px 24px',
        marginTop: '24px',
        marginBottom: '24px',
        background: 'rgba(26,26,31,0.4)',
      }}
    >
      {/* 번호 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: '#8a8a96',
            textTransform: 'uppercase',
            border: '1px solid #3a3a44',
            borderRadius: '3px',
            padding: '2px 8px',
          }}
        >
          {number}
        </span>
      </div>

      {/* 진술 */}
      <div
        className="ko-text"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '15.5px',
          lineHeight: 1.8,
          color: '#d8d8dd',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
            strong: ({ children }) => (
              <strong style={{ color: '#ececef', fontWeight: 600 }}>{children}</strong>
            ),
          }}
        >
          {statement}
        </ReactMarkdown>
      </div>

      {/* 증명 토글 */}
      {proof && (
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setProofOpen((o) => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#8a8a96',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 0',
            }}
          >
            <span style={{ transition: 'transform 200ms', display: 'inline-block', transform: proofOpen ? 'rotate(90deg)' : '' }}>▸</span>
            {proofOpen ? '증명 접기' : '증명 보기'}
          </button>
          {proofOpen && (
            <div
              className="ko-text"
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #1a1a1f',
                fontSize: '13.5px',
                lineHeight: 1.8,
                color: '#8a8a96',
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p style={{ margin: '0 0 10px 0' }}>{children}</p>,
                  strong: ({ children }) => (
                    <strong style={{ color: '#b8b8c0', fontWeight: 600 }}>{children}</strong>
                  ),
                }}
              >
                {proof}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
