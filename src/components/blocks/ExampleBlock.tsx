'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { VisualizationStep } from '@/types/visualization';
import { VisualizeButton } from '@/components/inline/VisualizeButton';

interface ExampleBlockProps {
  id: string;
  number: string;
  problem: string;
  hint?: string;
  solution: string;
  visualize: VisualizationStep[];
}

const md = {
  remarkPlugins: [remarkMath] as Parameters<typeof ReactMarkdown>[0]['remarkPlugins'],
  rehypePlugins: [rehypeKatex] as Parameters<typeof ReactMarkdown>[0]['rehypePlugins'],
};

export function ExampleBlock({ number, problem, hint, solution, visualize }: ExampleBlockProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #1a1a1f',
        borderRadius: '6px',
        overflow: 'hidden',
        marginTop: '24px',
        marginBottom: '24px',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          background: '#111114',
          borderBottom: '1px solid #1a1a1f',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#d4ff4f',
          }}
        >
          {number}
        </span>
        <VisualizeButton steps={visualize} />
      </div>

      <div style={{ padding: '20px' }}>
        {/* 문제 */}
        <div
          className="ko-text"
          style={{ fontSize: '14.5px', lineHeight: 1.8, color: '#d8d8dd', marginBottom: '16px' }}
        >
          <ReactMarkdown
            {...md}
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#ececef' }}>{children}</strong>,
            }}
          >
            {problem}
          </ReactMarkdown>
        </div>

        {/* 독립 아코디언 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* 힌트 */}
          {hint && (
            <div>
              <button
                onClick={() => setHintOpen((o) => !o)}
                style={{
                  background: 'none',
                  border: '1px solid #26262d',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#8a8a96',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    transform: hintOpen ? 'rotate(90deg)' : '',
                    display: 'inline-block',
                    transition: 'transform 200ms',
                  }}
                >
                  ▸
                </span>
                힌트 보기
              </button>
              {hintOpen && (
                <div
                  className="ko-text"
                  style={{
                    marginTop: '10px',
                    padding: '12px 16px',
                    background: 'rgba(26,26,31,0.6)',
                    borderRadius: '4px',
                    fontSize: '13.5px',
                    lineHeight: 1.75,
                    color: '#8a8a96',
                  }}
                >
                  <ReactMarkdown {...md} components={{ p: ({ children }) => <p style={{ margin: 0 }}>{children}</p> }}>
                    {hint}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* 풀이 */}
          <div>
            <button
              onClick={() => setSolutionOpen((o) => !o)}
              style={{
                background: 'none',
                border: '1px solid #26262d',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#8a8a96',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  transform: solutionOpen ? 'rotate(90deg)' : '',
                  display: 'inline-block',
                  transition: 'transform 200ms',
                }}
              >
                ▸
              </span>
              풀이 보기
            </button>
            {solutionOpen && (
              <div
                className="ko-text"
                style={{
                  marginTop: '10px',
                  padding: '12px 16px',
                  background: 'rgba(26,26,31,0.8)',
                  borderRadius: '4px',
                  fontSize: '13.5px',
                  lineHeight: 1.8,
                  color: '#b8b8c0',
                }}
              >
                <ReactMarkdown
                  {...md}
                  components={{
                    p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: '#ececef' }}>{children}</strong>,
                  }}
                >
                  {solution}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
