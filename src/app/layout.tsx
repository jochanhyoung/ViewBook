import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "고등학교 수학 디지털 교과서",
  description: "미분과 적분의 개념을 시각적으로 배우는 인터랙티브 수학 교과서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>{children}</body>
    </html>
  );
}
