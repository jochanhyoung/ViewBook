'use client';
import { useEffect, useCallback } from 'react';
import { useTextbookStore } from '@/store/textbook-store';
import { pages } from '@/content/index';
import { LeftPane } from './LeftPane';
import { RightStage } from './RightStage';
import { PageChrome } from './PageChrome';
import { CameraFab } from '@/components/ai/CameraFab';
import { CameraModal } from '@/components/ai/CameraModal';

export function EbookShell() {
  const currentSlug = useTextbookStore((s) => s.currentPageSlug);
  const setPage = useTextbookStore((s) => s.setPage);
  const advanceStage = useTextbookStore((s) => s.advanceStage);
  const retreatStage = useTextbookStore((s) => s.retreatStage);
  const cameraOpen = useTextbookStore((s) => s.cameraOpen);

  const currentIndex = pages.findIndex((p) => p.slug === currentSlug);
  const currentPage = pages[currentIndex] ?? pages[0];

  const goNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      setPage(pages[currentIndex + 1].slug);
    }
  }, [currentIndex, setPage]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setPage(pages[currentIndex - 1].slug);
    }
  }, [currentIndex, setPage]);

  // 키보드 내비게이션
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ']') goNext();
      if (e.key === '[') goPrev();
      if (e.key === 'ArrowRight') advanceStage();
      if (e.key === 'ArrowLeft') retreatStage();
      if (e.key === ' ') {
        e.preventDefault();
        advanceStage();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, advanceStage, retreatStage]);

  const progress = ((currentIndex + 1) / pages.length) * 100;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 진행 바 */}
      <div style={{ height: '2px', background: '#1a1a1f', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#d4ff4f',
            transition: 'width 400ms ease',
          }}
        />
      </div>

      {/* 메인 분할 영역 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 좌측: 교과서 본문 (48%) */}
        <div style={{ width: '48%', flexShrink: 0, overflow: 'hidden' }}>
          <LeftPane page={currentPage} />
        </div>

        {/* 중앙 hairline + 페이지 번호 */}
        <div
          style={{
            width: '1px',
            background: '#1a1a1f',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#3a3a44',
              letterSpacing: '0.3em',
              writingMode: 'vertical-rl',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            {currentPage.number}
          </span>
        </div>

        {/* 우측: 시각화 무대 (52%) */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <RightStage />
        </div>
      </div>

      {/* 하단 내비게이션 */}
      <PageChrome
        currentIndex={currentIndex}
        total={pages.length}
        onPrev={goPrev}
        onNext={goNext}
        pages={pages}
      />

      {/* AI 풀이 FAB */}
      <CameraFab />

      {/* 카메라 모달 */}
      {cameraOpen && <CameraModal />}
    </div>
  );
}
