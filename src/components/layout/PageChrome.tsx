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
      style={{
        height: '48px',
        background: '#111114',
        borderTop: '1px solid #1a1a1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
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
          color: currentIndex === 0 ? '#26262d' : '#8a8a96',
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
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {pages.map((page, i) => (
          <button
            key={page.slug}
            onClick={() => setPage(page.slug)}
            title={page.title}
            style={{
              width: i === currentIndex ? '20px' : '6px',
              height: '4px',
              background: i === currentIndex ? '#d4ff4f' : '#26262d',
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
          color: currentIndex === total - 1 ? '#26262d' : '#8a8a96',
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
