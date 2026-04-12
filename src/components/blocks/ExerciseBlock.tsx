'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Exercise } from '@/types/content';
import { VisualizeButton } from '@/components/inline/VisualizeButton';

interface ExerciseBlockProps {
  exercise: Exercise;
}

const md = {
  remarkPlugins: [remarkMath] as Parameters<typeof ReactMarkdown>[0]['remarkPlugins'],
  rehypePlugins: [rehypeKatex] as Parameters<typeof ReactMarkdown>[0]['rehypePlugins'],
};

export function ExerciseBlock({ exercise }: ExerciseBlockProps) {
  const [openHints, setOpenHints] = useState<Set<number>>(new Set());
  const [solutionOpen, setSolutionOpen] = useState(false);

  const toggleHint = (i: number) =>
    setOpenHints((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div style={{ paddingBottom: '24px', borderBottom: '1px solid #1a1a1f' }}>
      {/* 번호 + 시각화 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: '#5a5a66',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          {exercise.number}
        </p>
        <VisualizeButton steps={exercise.visualize} />
      </div>

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
          {exercise.problem}
        </ReactMarkdown>
      </div>

      {/* 힌트들 — 모두 독립 아코디언 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {exercise.hints.map((hint, i) => (
          <div key={i}>
            <button
              onClick={() => toggleHint(i)}
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
                  transform: openHints.has(i) ? 'rotate(90deg)' : '',
                  display: 'inline-block',
                  transition: 'transform 200ms',
                }}
              >
                ▸
              </span>
              힌트 {i + 1} 보기
            </button>
            {openHints.has(i) && (
              <div
                className="ko-text"
                style={{
                  marginTop: '8px',
                  padding: '10px 14px',
                  background: 'rgba(26,26,31,0.6)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: '#8a8a96',
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    color: '#5a5a66',
                    textTransform: 'uppercase',
                  }}
                >
                  힌트 {i + 1}
                </p>
                <ReactMarkdown {...md} components={{ p: ({ children }) => <p style={{ margin: 0 }}>{children}</p> }}>
                  {hint}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* 풀이 — 독립 아코디언 */}
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
                padding: '14px 16px',
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
                {exercise.solution}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
