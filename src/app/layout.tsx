import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "고등학교 수학 디지털 교과서",
  description: "미분과 적분의 개념을 시각적으로 배우는 인터랙티브 수학 교과서",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * 하이드레이션 전에 테마를 적용하는 인라인 스크립트
 * — localStorage 값을 읽어 html 클래스를 즉시 세팅
 * — 이 스크립트가 없으면 'dark' 기본값으로 플래시가 발생할 수 있음
 */
const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('mathbook-theme');
    var theme = (saved === 'dark' || saved === 'light') ? saved : 'dark';
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * suppressHydrationWarning: 서버는 기본 'dark' 클래스를,
     * 클라이언트는 localStorage 값을 읽어 클래스를 변경하므로
     * 불일치 경고를 억제합니다.
     */
    <html lang="ko" className="dark" suppressHydrationWarning style={{ height: '100%' }}>
      <head>
        {/* 테마 플래시 방지 — body보다 먼저 실행 */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
