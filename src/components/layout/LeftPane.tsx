'use client';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { ExerciseBlock } from '@/components/blocks/ExerciseBlock';
import type { Page } from '@/types/content';

interface LeftPaneProps {
  page: Page;
}

export function LeftPane({ page }: LeftPaneProps) {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ scrollbarGutter: 'stable' }}
    >
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '80px 64px' }}>
        {/* 페이지 메타 */}
        <div className="mb-8">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8a8a96',
              marginBottom: '4px',
            }}
          >
            {page.chapter}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#5a5a66',
            }}
          >
            {page.section}
          </p>
        </div>

        {/* 학습 목표 */}
        <div
          className="mb-10"
          style={{
            borderLeft: '2px solid #26262d',
            paddingLeft: '20px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#5a5a66',
              marginBottom: '10px',
            }}
          >
            학습 목표
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {page.learningObjectives.map((obj) => (
              <li
                key={obj.id}
                style={{
                  fontSize: '13px',
                  color: '#8a8a96',
                  lineHeight: 1.6,
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#d4ff4f', flexShrink: 0 }}>—</span>
                <span className="ko-text">{obj.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 본문 블록들 */}
        <BlockRenderer blocks={page.blocks} />

        {/* 연습문제 */}
        {page.exercises.length > 0 && (
          <div className="mt-16">
            <div
              style={{
                borderTop: '1px solid #1a1a1f',
                paddingTop: '32px',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#5a5a66',
                }}
              >
                연습문제
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {page.exercises.map((ex) => (
                <ExerciseBlock key={ex.id} exercise={ex} />
              ))}
            </div>
          </div>
        )}

        {/* 핵심 용어 */}
        {page.keyTerms.length > 0 && (
          <div className="mt-16 mb-8">
            <div
              style={{
                borderTop: '1px solid #1a1a1f',
                paddingTop: '32px',
                marginBottom: '20px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#5a5a66',
                }}
              >
                핵심 용어
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {page.keyTerms.map((term) => (
                <div key={term.term} style={{ display: 'flex', gap: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '14px',
                      color: '#ececef',
                      minWidth: '100px',
                      flexShrink: 0,
                    }}
                  >
                    {term.term}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#8a8a96',
                      lineHeight: 1.6,
                    }}
                    className="ko-text"
                  >
                    {term.short}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
