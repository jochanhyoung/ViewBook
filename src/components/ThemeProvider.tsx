'use client';
/**
 * ThemeProvider — 라이트/다크 모드 전역 컨텍스트
 *
 * 동작 방식:
 * 1. 마운트 시 localStorage의 'theme' 값을 읽어 초기 테마 결정
 * 2. 저장 값이 없으면 'dark' 기본값 사용
 * 3. html 엘리먼트에 'dark' 또는 'light' 클래스를 토글
 * 4. 변경 시 localStorage에 즉시 저장
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/** 지원하는 테마 타입 */
export type Theme = 'dark' | 'light';

/** 컨텍스트 인터페이스 */
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

/** 컨텍스트 기본값 (Provider 없이 사용 방지용) */
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

/** localStorage 키 */
const STORAGE_KEY = 'mathbook-theme';

/** html 엘리먼트에 테마 클래스를 적용하는 순수 함수 */
function applyThemeClass(theme: Theme) {
  const html = document.documentElement;
  // 기존 테마 클래스 제거 후 새 클래스 추가
  html.classList.remove('dark', 'light');
  html.classList.add(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 초기값은 'dark' — SSR/hydration 불일치 방지
  const [theme, setThemeState] = useState<Theme>('dark');

  // 클라이언트 마운트 시 localStorage 값으로 초기화
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      saved === 'dark' || saved === 'light' ? saved : 'dark';
    setThemeState(initial);
    applyThemeClass(initial);
  }, []);

  /** 테마를 명시적으로 설정 */
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyThemeClass(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  /** 다크 ↔ 라이트 토글 */
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyThemeClass(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme — 테마 컨텍스트 훅
 * 모든 클라이언트 컴포넌트에서 호출 가능
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
