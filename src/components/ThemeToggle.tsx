'use client';
/**
 * ThemeToggle — 다크/라이트 모드 전환 슬라이더
 *
 * UI 구조:
 *   [🌙 ──●────── ☀] 다크 모드
 *   [🌙 ──────●── ☀] 라이트 모드
 *
 * 접근성:
 * - role="switch" + aria-checked 로 스크린리더 지원
 * - aria-label 제공
 * - 키보드: Space/Enter 로 토글
 */

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? '다크 모드로 전환' : '라이트 모드로 전환'}
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleTheme();
        }
      }}
      style={{
        /* 컨테이너: 아이콘 + 트랙을 가로 정렬 */
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '20px',
        outline: 'none',
        /* 포커스 링 — CSS 변수 사용 */
        boxShadow: 'none',
        transition: 'box-shadow 150ms ease',
      }}
      /* 포커스 가시성은 :focus-visible 로 처리 */
      className="theme-toggle-btn"
    >
      {/* 달 아이콘 (다크 모드 측) */}
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{
          color: isLight
            ? 'var(--color-text-ghost)'
            : 'var(--color-text-subtle)',
          transition: 'color 200ms ease',
          flexShrink: 0,
        }}
      >
        <path
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 슬라이더 트랙 */}
      <div
        style={{
          position: 'relative',
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          background: isLight
            ? 'var(--color-accent-bg)'
            : 'var(--color-bg-subtle)',
          border: '1px solid',
          borderColor: isLight
            ? 'var(--color-accent)'
            : 'var(--color-border)',
          transition:
            'background 200ms ease, border-color 200ms ease',
          flexShrink: 0,
        }}
      >
        {/* 슬라이더 핸들 (동그라미) */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: isLight ? '17px' : '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: isLight
              ? 'var(--color-accent)'
              : 'var(--color-text-subtle)',
            transition: 'left 200ms ease, background 200ms ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* 태양 아이콘 (라이트 모드 측) */}
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{
          color: isLight
            ? 'var(--color-accent)'
            : 'var(--color-text-ghost)',
          transition: 'color 200ms ease',
          flexShrink: 0,
        }}
      >
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
        <line x1="12" y1="1"  x2="12" y2="3"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="1"  y1="12" x2="3"  y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
