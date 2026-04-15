'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import type { CSSProperties } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LatexTextRenderer } from '@/components/inline/LatexTextRenderer';
import { AnimatePresence, motion } from 'framer-motion';
import { paginate } from '@/lib/paginate';
import type { Page, Block, Exercise, KeyTerm } from '@/types/content';
import type { Sheet } from '@/lib/paginate';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { ExerciseBlock } from '@/components/blocks/ExerciseBlock';
import { CameraFab } from '@/components/ai/CameraFab';
import { CameraModal } from '@/components/ai/CameraModal';
import { useTextbookStore } from '@/store/textbook-store';
import { coursePages, getCourseBySlug } from '@/content/index';
import type { CourseId } from '@/content/index';
import { ThemeToggle } from '@/components/ThemeToggle';

interface BookViewerProps {
  page: Page;
}

// ── sheet 인덱스를 URL ?sheet=N 으로 관리하는 훅 ──────────────────
function useSheetIndex(totalSheets: number, slug: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = Number(searchParams.get('sheet') ?? '0');
  const currentSheet = Number.isFinite(raw)
    ? Math.min(Math.max(0, raw), Math.max(0, totalSheets - 1))
    : 0;

  const setSheet = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(0, next), totalSheets - 1);
      const params = new URLSearchParams(searchParams.toString());
      params.set('sheet', String(clamped));
      // replace + scroll:false → 책장 넘김이 히스토리를 오염시키지 않게
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      // 진도 저장
      try { localStorage.setItem(`progress:${slug}`, String(clamped)); } catch { /* 무시 */ }
    },
    [router, pathname, searchParams, totalSheets, slug]
  );

  // ?sheet= 없이 진입했을 때 localStorage 진도 복원
  useEffect(() => {
    if (searchParams.get('sheet') === null) {
      try {
        const saved = localStorage.getItem(`progress:${slug}`);
        if (saved !== null) {
          const s = parseInt(saved, 10);
          if (!isNaN(s) && s > 0 && s < totalSheets) {
            setSheet(s);
          }
        }
      } catch { /* localStorage 미지원 */ }
    }
  // page 변경 시에만 실행
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    currentSheet,
    goNext: () => setSheet(currentSheet + 1),
    goPrev: () => setSheet(currentSheet - 1),
    setSheet,
  };
}

// ── 실제 뷰어 (useSearchParams 사용 → Suspense 필요) ─────────────
function BookViewerInner({ page }: BookViewerProps) {
  const router = useRouter();
  const sheets = paginate(page);
  const { currentSheet: sheetIdx, setSheet } = useSheetIndex(sheets.length, page.slug);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const courseMenuRef = useRef<HTMLDivElement>(null);
  const chapterMenuRef = useRef<HTMLDivElement>(null);

  // 애니메이션 방향 추적
  const [direction, setDirection] = useState(0);
  const prevSheetRef = useRef(sheetIdx);
  useEffect(() => {
    if (sheetIdx !== prevSheetRef.current) {
      setDirection(sheetIdx > prevSheetRef.current ? 1 : -1);
      prevSheetRef.current = sheetIdx;
    }
  }, [sheetIdx]);

  const navigate = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(sheetIdx + delta, sheets.length - 1));
      if (next !== sheetIdx) setSheet(next);
    },
    [sheetIdx, sheets.length, setSheet]
  );

  const cameraOpen = useTextbookStore((s) => s.cameraOpen);
  const currentCourse = getCourseBySlug(page.slug) ?? 'high';
  const currentCoursePages = coursePages[currentCourse];
  const pageIdx = currentCoursePages.findIndex((p) => p.slug === page.slug);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const sheet = sheets[sheetIdx];
  const contentRef = useRef<HTMLDivElement>(null);

  // Sheet 전환 시 메인 콘텐츠 포커스
  useEffect(() => { contentRef.current?.focus(); }, [sheetIdx]);

  // 키보드 내비게이션
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ']') navigate(1);
      if (e.key === 'ArrowLeft' || e.key === '[') navigate(-1);
      if (e.key === 'Home') { e.preventDefault(); setSheet(0); }
      if (e.key === 'End') { e.preventDefault(); setSheet(sheets.length - 1); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, setSheet, sheets.length]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!courseMenuRef.current?.contains(event.target as Node)) {
        setCourseMenuOpen(false);
      }
      if (!chapterMenuRef.current?.contains(event.target as Node)) {
        setChapterMenuOpen(false);
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const headerButtonStyle: CSSProperties = {
    width: '84px',
    height: '24px',
    border: '1px solid var(--color-bg-surface)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-subtle)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    lineHeight: 1,
    cursor: 'pointer',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const courseOptions: Array<{ id: CourseId; label: string }> = [
    { id: 'elementary', label: '초등 과정' },
    { id: 'middle', label: '중등 과정' },
    { id: 'high', label: '고등 과정' },
  ];

  const handleCourseSelect = useCallback(
    (courseId: CourseId) => {
      setCourseMenuOpen(false);
      setChapterMenuOpen(false);
      const targetPage = coursePages[courseId][0];
      if (!targetPage) return;
      router.push(`/read/${targetPage.slug}?sheet=0`);
    },
    [router]
  );

  const handleChapterSelect = useCallback(
    (slug: string) => {
      setChapterMenuOpen(false);
      router.push(`/read/${slug}?sheet=0`);
    },
    [router]
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-bg)' }}>
      {/* 스크린리더 공지 */}
      <div aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {`${page.title} — ${sheetIdx + 1}페이지 / 전체 ${sheets.length}페이지`}
      </div>

      {/* Top progress bar */}
      <div style={{ height: '2px', background: 'var(--color-bg-surface)', flexShrink: 0, position: 'relative' }}>
        <div style={{ height: '100%', width: `${((sheetIdx + 1) / sheets.length) * 100}%`, background: 'var(--color-accent)', transition: 'width 350ms ease' }} />
      </div>

      {/* Header bar */}
      <div style={{ height: '44px', borderBottom: '1px solid var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        {/* Page nav */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div ref={courseMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={courseMenuOpen}
              onClick={() => setCourseMenuOpen((open) => !open)}
              style={headerButtonStyle}
            >
              과정 선택
            </button>

            {courseMenuOpen && (
              <div
                role="menu"
                aria-label="과정 선택"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 1px)',
                  left: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  zIndex: 30,
                }}
              >
                {courseOptions.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={currentCourse === course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    style={{
                      ...headerButtonStyle,
                      background: currentCourse === course.id ? 'var(--color-bg-surface)' : 'var(--color-bg)',
                      color: currentCourse === course.id ? 'var(--color-text)' : 'var(--color-text-subtle)',
                    }}
                  >
                    {course.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '14px' }}>
            {pageIdx > 0 && (
              <a href={`/read/${currentCoursePages[pageIdx - 1].slug}?sheet=0`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                ← {currentCoursePages[pageIdx - 1].number}
              </a>
            )}
            <div ref={chapterMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={chapterMenuOpen}
                onClick={() => setChapterMenuOpen((open) => !open)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-text-subtle)',
                }}
              >
                {page.number}&ensp;{page.title}
              </button>
              {chapterMenuOpen && (
                <div
                  role="menu"
                  aria-label="챕터 선택"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--color-bg-surface)',
                    background: 'var(--color-bg)',
                    zIndex: 30,
                  }}
                >
                  {currentCoursePages.map((coursePage) => (
                    <button
                      key={coursePage.slug}
                      type="button"
                      role="menuitemradio"
                      aria-checked={coursePage.slug === page.slug}
                      onClick={() => handleChapterSelect(coursePage.slug)}
                      style={{
                        height: '28px',
                        border: 'none',
                        borderBottom: '1px solid var(--color-bg-surface)',
                        background: coursePage.slug === page.slug ? 'var(--color-bg-surface)' : 'var(--color-bg)',
                        color: coursePage.slug === page.slug ? 'var(--color-text)' : 'var(--color-text-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textAlign: 'left',
                        padding: '0 10px',
                        cursor: 'pointer',
                      }}
                    >
                      {coursePage.number} {coursePage.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {pageIdx < currentCoursePages.length - 1 && (
              <a href={`/read/${currentCoursePages[pageIdx + 1].slug}?sheet=0`} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                {currentCoursePages[pageIdx + 1].number} →
              </a>
            )}
          </div>
        </div>

        {/* 우측: 다크/라이트 토글 + 시트 인디케이터 도트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />

          {/* Sheet indicator dots */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {sheets.map((_, i) => (
              <button
                key={i}
                onClick={() => setSheet(i)}
                style={{
                  width: i === sheetIdx ? '16px' : '4px',
                  height: '4px',
                  background: i === sheetIdx ? 'var(--color-accent)' : 'var(--color-border)',
                  borderRadius: '2px', border: 'none', cursor: 'pointer',
                  transition: 'all 250ms ease', padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sheet content */}
      <div ref={contentRef} tabIndex={-1} style={{ flex: 1, overflow: 'hidden', position: 'relative', outline: 'none' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${page.slug}-${sheetIdx}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
            style={{ height: '100%', overflow: 'hidden' }}
          >
            <SheetContent sheet={sheet} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div style={{ height: '52px', borderTop: '1px solid var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          disabled={sheetIdx === 0}
          style={{ background: 'none', border: 'none', cursor: sheetIdx === 0 ? 'default' : 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: sheetIdx === 0 ? 'var(--color-border)' : 'var(--color-text-subtle)', padding: '4px 8px' }}
        >
          ← 이전
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>
          {sheetIdx + 1} / {sheets.length}
        </span>

        <button
          onClick={() => navigate(1)}
          disabled={sheetIdx >= sheets.length - 1}
          style={{ background: 'none', border: 'none', cursor: sheetIdx >= sheets.length - 1 ? 'default' : 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: sheetIdx >= sheets.length - 1 ? 'var(--color-border)' : 'var(--color-text-subtle)', padding: '4px 8px' }}
        >
          다음 →
        </button>
      </div>

      {/* AI FAB */}
      <CameraFab />
      {cameraOpen && <CameraModal />}
    </div>
  );
}

// ── 공개 컴포넌트 — useSearchParams 사용처를 Suspense로 감싸서
//    generateStaticParams 페이지의 SSG를 보호 ─────────────────────
export function BookViewer({ page }: BookViewerProps) {
  return (
    <Suspense fallback={<div style={{ background: 'var(--color-bg)', height: '100vh' }} />}>
      <BookViewerInner page={page} />
    </Suspense>
  );
}

// ── Sheet 렌더러 ────────────────────────────────────────────────
function SheetContent({ sheet }: { sheet: Sheet }) {
  switch (sheet.kind) {
    case 'intro':     return <IntroSheet page={sheet.page} />;
    case 'content':   return <ContentSheet blocks={sheet.blocks} />;
    case 'exercises': return <ExercisesSheet exercises={sheet.exercises} />;
    case 'terms':     return <TermsSheet keyTerms={sheet.keyTerms} />;
  }
}

function SheetWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', scrollbarGutter: 'stable' }}>
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '48px 40px 64px' }}>
        {children}
      </div>
    </div>
  );
}

function IntroSheet({ page }: { page: Page }) {
  return (
    <SheetWrap>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
        {page.chapter}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-ghost)', marginBottom: '32px' }}>
        {page.section}
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-text)', fontWeight: 600, lineHeight: 1.2, marginBottom: '8px' }}>
        {page.title}
      </h1>
      {page.subtitle && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-subtle)', marginBottom: '40px' }}>
          <LatexTextRenderer text={page.subtitle} />
        </p>
      )}
      <div style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '20px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
          학습 목표
        </p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {page.learningObjectives.map((obj) => (
            <li key={obj.id} style={{ fontSize: '13.5px', color: 'var(--color-text-subtle)', lineHeight: 1.65, display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>—</span>
              <LatexTextRenderer text={obj.text} className="ko-text" />
            </li>
          ))}
        </ul>
      </div>
    </SheetWrap>
  );
}

function ContentSheet({ blocks }: { blocks: Block[] }) {
  return (
    <SheetWrap>
      <BlockRenderer blocks={blocks} />
    </SheetWrap>
  );
}

function ExercisesSheet({ exercises }: { exercises: Exercise[] }) {
  return (
    <SheetWrap>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '24px', borderBottom: '1px solid var(--color-bg-surface)', paddingBottom: '16px' }}>
        연습문제
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {exercises.map((ex) => (
          <ExerciseBlock key={ex.id} exercise={ex} />
        ))}
      </div>
    </SheetWrap>
  );
}

function TermsSheet({ keyTerms }: { keyTerms: KeyTerm[] }) {
  return (
    <SheetWrap>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '24px', borderBottom: '1px solid var(--color-bg-surface)', paddingBottom: '16px' }}>
        핵심 용어
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {keyTerms.map((term) => (
          <div key={term.term} style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--color-text)', minWidth: '110px', flexShrink: 0 }}>
              {term.term}
            </span>
            <LatexTextRenderer
              text={term.short}
              className="ko-text"
              style={{ fontSize: '13px', color: 'var(--color-text-subtle)', lineHeight: 1.6 }}
            />
          </div>
        ))}
      </div>
    </SheetWrap>
  );
}
