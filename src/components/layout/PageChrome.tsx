'use client';
import { useTextbookStore } from '@/store/textbook-store';
import type { Page } from '@/types/content';

interface PageChromeProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  pages: Page[];
}

export function PageChrome({ currentIndex, total, onPrev, onNext, pages }: PageChromeProps) {
  const setPage = useTextbookStore((s) => s.setPage);

  return (
    <div
      className="flex min-h-[56px] items-center justify-between gap-3 px-3 sm:min-h-12 sm:px-4 md:px-6"
      style={{
        background: 'var(--color-bg-elevated)',
        borderTop: '1px solid var(--color-bg-surface)',
        flexShrink: 0,
      }}
    >
      {/* 좌측: 이전 버튼 */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        style={{
          background: 'none',
          border: 'none',
          cursor: currentIndex === 0 ? 'default' : 'pointer',
          color: currentIndex === 0 ? 'var(--color-border)' : 'var(--color-text-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'color 150ms',
        }}
      >
        ← 이전
      </button>

      {/* 중앙: 페이지 점 표시기 */}
      <div className="mx-2 flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto">
        {pages.map((page, i) => (
          <button
            key={page.slug}
            onClick={() => setPage(page.slug)}
            title={page.title}
            style={{
              width: i === currentIndex ? '20px' : '6px',
              height: '4px',
              background: i === currentIndex ? 'var(--color-accent)' : 'var(--color-border)',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 300ms ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* 우측: 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={currentIndex === total - 1}
        style={{
          background: 'none',
          border: 'none',
          cursor: currentIndex === total - 1 ? 'default' : 'pointer',
          color: currentIndex === total - 1 ? 'var(--color-border)' : 'var(--color-text-subtle)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'color 150ms',
        }}
      >
        다음 →
      </button>
    </div>
  );
}
