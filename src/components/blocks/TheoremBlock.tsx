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
    <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '20px 24px', marginTop: '24px', marginBottom: '24px', background: 'var(--color-overlay-soft)' }}>
      {/* 번호 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-text-subtle)', textTransform: 'uppercase', border: '1px solid var(--color-text-ghost)', borderRadius: '3px', padding: '2px 8px' }}>
          {number}
        </span>
      </div>

      {/* 진술 */}
      <div className="ko-text" style={{ fontFamily: 'var(--font-display)', fontSize: '15.5px', lineHeight: 1.8, color: 'var(--color-text-dim)' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{children}</strong>,
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}
          >
            <span style={{ transition: 'transform 200ms', display: 'inline-block', transform: proofOpen ? 'rotate(90deg)' : '' }}>▸</span>
            {proofOpen ? '증명 접기' : '증명 보기'}
          </button>
          {proofOpen && (
            <div className="ko-text" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-bg-surface)', fontSize: '13.5px', lineHeight: 1.8, color: 'var(--color-text-subtle)' }}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p style={{ margin: '0 0 10px 0' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>{children}</strong>,
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
