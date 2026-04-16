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
      <div className="mx-auto w-full max-w-[620px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:px-12 lg:py-20">
        {/* 페이지 메타 */}
        <div className="mb-8">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', marginBottom: '4px' }}>
            {page.chapter}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-text-muted)' }}>
            {page.section}
          </p>
        </div>

        {/* 학습 목표 */}
        <div className="mb-10" style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '20px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
            학습 목표
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {page.learningObjectives.map((obj) => (
              <li key={obj.id} style={{ fontSize: '13px', color: 'var(--color-text-subtle)', lineHeight: 1.6, display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>—</span>
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
            <div style={{ borderTop: '1px solid var(--color-bg-surface)', paddingTop: '32px', marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
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
            <div style={{ borderTop: '1px solid var(--color-bg-surface)', paddingTop: '32px', marginBottom: '20px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                핵심 용어
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {page.keyTerms.map((term) => (
                <div key={term.term} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--color-text)', minWidth: '100px', flexShrink: 0 }}>
                    {term.term}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)', lineHeight: 1.6 }} className="ko-text">
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
